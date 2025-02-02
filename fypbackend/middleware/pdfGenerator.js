const { PDFDocument, StandardFonts } = require('pdf-lib');
const axios = require('axios');
require('dotenv').config();

// Filestack API Key from your .env
const FILESTACK_API_KEY = process.env.FILESTACK_API_KEY;

// Function to create a PDF from the given content
const generatePDFAndUpload = async (content) => {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add a page to the document
    const page = pdfDoc.addPage([600, 800]); // Set page size
    const { width, height } = page.getSize();

    // Embed the font correctly
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;

    // Add the content to the page
    page.drawText(content, { x: 50, y: height - 50, font, size: fontSize });

    // Serialize the PDF document to bytes
    const pdfBytes = await pdfDoc.save();

    // Upload the PDF file to Filestack and return the file URL
    const pdfUrl = await uploadToFilestack(pdfBytes);
    return pdfUrl;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate the PDF.');
  }
};

// Function to upload the PDF file to Filestack using raw binary data
const uploadToFilestack = async (pdfBytes) => {
  try {
    // Convert pdfBytes to a Buffer
    const buffer = Buffer.from(pdfBytes);

    // Upload the file to Filestack using raw binary data (HTTP POST)
    const response = await axios.post(
      `https://www.filestackapi.com/api/store/S3?key=${FILESTACK_API_KEY}`,
      buffer, {
        headers: {
          'Content-Type': 'application/pdf',  // Set the correct MIME type for PDF
          'Content-Length': buffer.length,    // Set the correct content length
        },
      }
    );

    // Return the URL of the uploaded PDF file
    return response.data.url;
  } catch (error) {
    console.error('Error uploading PDF to Filestack:', error);
    throw new Error('Failed to upload the PDF.');
  }
};

module.exports = { generatePDFAndUpload };
