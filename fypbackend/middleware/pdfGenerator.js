const PDFDocument = require('pdfkit');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const FILESTACK_API_KEY = process.env.FILESTACK_API_KEY;

/**
 * Function to generate a security vulnerability report PDF and upload it.
 * @param {Object} reportData - The security report summary from the LLM.
 * @returns {Promise<string>} - The Filestack URL of the uploaded PDF.
 */
const generatePDFAndUpload = async (reportData) => {
    return new Promise((resolve, reject) => {
        try {
            const summary = reportData;
            if (!summary || typeof summary !== 'string') {
                throw new Error('Invalid report data: summary is missing or not a string.');
            }

            // Create a PDF document in memory
            const doc = new PDFDocument();
            let buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', async function () {
                try {
                    const pdfBuffer = Buffer.concat(buffers);
                    const pdfUrl = await uploadToFilestack(pdfBuffer); // Wait for upload to finish
                    resolve(pdfUrl); // Resolve the promise with the URL
                } catch (uploadError) {
                    console.error('Error uploading PDF:', uploadError);
                    reject(new Error('Failed to upload the PDF.'));
                }
            });

            // PDF Formatting
            doc.font('Helvetica-Bold').fontSize(20).text('Security Vulnerability Report', { align: 'center' });
            doc.moveDown();

            summary.split("\n").forEach(line => {
                line = line.trim();

                // Handle Headings
                if (line.startsWith("### ")) {
                    doc.moveDown().font('Helvetica-Bold').fontSize(16).text(line.replace("### ", ""));
                } else if (line.startsWith("#### ")) {
                    doc.moveDown().font('Helvetica-Bold').fontSize(14).text(line.replace("#### ", ""));
                }
                // Handle Bold Text
                else if (/\*\*(.*?)\*\*/.test(line)) {
                    let formattedText = line.replace(/\*\*(.*?)\*\*/g, (match, p1) => `\x01${p1}\x02`); // Mark bold text
                    formattedText.split(/\x01(.*?)\x02/).forEach((segment, index) => {
                        if (index % 2 === 1) {
                            doc.font('Helvetica-Bold').text(segment, { continued: true });
                        } else {
                            doc.font('Helvetica').text(segment, { continued: true });
                        }
                    });
                    doc.text(" "); // Move to the next line
                }
                // Handle Bullet Points
                else if (line.startsWith("- ") || line.startsWith("• ")) {
                    doc.font('Helvetica').text(`• ${line.substring(2)}`, { indent: 20 });
                }
                // Normal Text
                else {
                    doc.font('Helvetica').text(line);
                }
            });

            // Finalize the document
            doc.end();
        } catch (error) {
            console.error('Error generating or uploading PDF:', error);
            reject(new Error('Failed to generate the PDF.'));
        }
    });
};

/**
 * Function to upload the PDF to Filestack
 * @param {Buffer} pdfBuffer - The generated PDF as a buffer
 * @returns {Promise<string>} - The URL of the uploaded PDF
 */
const uploadToFilestack = async (pdfBuffer) => {
    try {
        const response = await axios.post(
            `https://www.filestackapi.com/api/store/S3?key=${FILESTACK_API_KEY}`,
            pdfBuffer,
            {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Length': pdfBuffer.length,
                },
            }
        );
        return response.data.url;
    } catch (error) {
        console.error('Error uploading PDF to Filestack:', error);
        throw new Error('Failed to upload the PDF.');
    }
};

module.exports = { generatePDFAndUpload };
