const axios = require("axios");
const { generatePDFAndUpload } = require("../middleware/pdfGenerator");
require("dotenv").config();

// VM Server Configuration
const VM_IP = process.env.VM_IP || "127.0.0.1";
const VM_PORT = process.env.VM_PORT || 3000;
const VM_SERVER_BASE_URL = `http://${VM_IP}:${VM_PORT}`;

const scanWebsiteAndGeneratePDF = async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ message: "URL is required." });
  }

  try {
    // Perform scans and get results
    const scanResults = await performScan(url);

    // Get LLM response
    const llmResponse = await getLLMResponse(scanResults);

    // Generate and upload PDF
    const pdfUrl = await generatePDFAndUpload(llmResponse);

    // Send JSON response
    return res.json({
      message: "Scan completed!",
      pdf_url: pdfUrl,
      scan_results: scanResults,
      llm_summary: llmResponse,
    });
  } catch (error) {
    console.error("Error during scan and processing:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

const performScan = async (url) => {
  const results = {};

  try {
    const metasploitResponse = await axios.post(`${VM_SERVER_BASE_URL}/scan`, { url, tool: "metasploit" });
    results.metasploit_output = metasploitResponse.data.results || "No results";
  } catch (error) {
    results.metasploit_output = `Metasploit Scan Failed: ${error.response?.data || error.message}`;
  }

  try {
    const nmapResponse = await axios.post(`${VM_SERVER_BASE_URL}/scan`, { url, tool: "nmap" });
    results.nmap_output = nmapResponse.data.results || "No results";
  } catch (error) {
    results.nmap_output = `Nmap Scan Failed: ${error.response?.data || error.message}`;
  }

  try {
    const zapResponse = await axios.post(`${VM_SERVER_BASE_URL}/scan`, { url, tool: "zap" });
    results.owasp_zap_output = zapResponse.data.output || "No results";
  } catch (error) {
    results.owasp_zap_output = `ZAP Scan Failed: ${error.response?.data || error.message}`;
  }

  return results;
};

const getLLMResponse = async (context) => {
  try {
    const response = await axios.post(`${process.env.LLM_URL}/generate`, context);
    return response.data.summary;
  } catch (error) {
    return `Error generating summary: ${error.message}`;
  }
};

module.exports = { scanWebsiteAndGeneratePDF };
