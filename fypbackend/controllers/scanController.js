const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const { generatePDFAndUpload } = require("../middleware/pdfGenerator");  // Assume you have a separate file for PDF creation
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
    res.setHeader("Content-Type", "text/plain");
    res.write("Starting the scan process...\n");

    // Scan Process with live streaming results
    const scanResults = await performScan(res, url);

    // Step 1: Send live scan results (already done above using res.write)

    // Step 2: Send scan results to LLM
    const llmResponse = await getLLMResponse(res,scanResults);
    const pdfUrl = await generatePDFAndUpload(llmResponse);

    // Step 4: Send PDF URL to the frontend
    return res.end(`Scan completed! You can download the PDF report from: ${pdfUrl}`);
  } catch (error) {
    console.error("Error during scan and processing:", error.message);
    res.write("Error during scan and processing:\n");
    res.write(`${error.message}\n`);

    return res.end(); // Ensures the function stops execution
  }
};


const performScan = async (res, url) => {
  let results = "";

  // Perform Metasploit Scan
  res.write("Starting Metasploit Scan...\n");
  try {
    const metasploitResponse = await axios.post(`${VM_SERVER_BASE_URL}/scan`, { url, tool: "metasploit" });
    const metasploitResults = JSON.stringify(metasploitResponse.data.results, null, 2);
    results += `Metasploit Scan Results:\n${metasploitResults}\n\n`;
    res.write("Metasploit Scan Completed...\n");
    res.write(`${results}\n`);
  } catch (error) {
    results += `Metasploit Scan Failed:\n${error.response?.data || error.message}\n\n`;
    res.write("Metasploit Scan Failed...\n");
  }

  // Perform Nmap Scan
  res.write("Starting Nmap Scan...\n");
  try {
    const nmapResponse = await axios.post(`${VM_SERVER_BASE_URL}/scan`, { url, tool: "nmap" });
    const nmapResults = JSON.stringify(nmapResponse.data.results, null, 2);
    results += `Nmap Scan Results:\n${nmapResults}\n\n`;
    res.write("Nmap Scan Completed...\n");
    res.write(`${results}\n`);
    

  } catch (error) {
    results += `Nmap Scan Failed:\n${error.response?.data || error.message}\n\n`;
    res.write("Nmap Scan Failed...\n");
  }

  // Perform ZAP Baseline Scan
  res.write("Starting ZAP Baseline Scan...\n");
  try {
    const zapResponse = await axios.post(`${VM_SERVER_BASE_URL}/scan`, { url, tool: "zap" });
    const zapResults = JSON.stringify(zapResponse.data.output, null, 2);
    results += `ZAP Baseline Scan Results:\n${zapResults}\n\n`;
    res.write("ZAP Scan Completed...\n");
    res.write(`${results}\n`);

  } catch (error) {
    results += `ZAP Scan Failed:\n${error.response?.data || error.message}\n\n`;
    res.write("ZAP Scan Failed...\n");
  }

  // Prepare the context for Flask API
  const context = {
    metasploit_output: results.split("Metasploit Scan Results:")[1]?.split("Nmap Scan Results:")[0]?.trim(),
    nmap_output: results.split("Nmap Scan Results:")[1]?.split("ZAP Baseline Scan Results:")[0]?.trim(),
    owasp_zap_output: results.split("ZAP Baseline Scan Results:")[1]?.trim(),
  };

  

  return context; // Return all scan results after the scan process
};


const getLLMResponse = async (res,context) => {
  // Send the results to the Flask API to get a user-friendly summary
  try {
    const response = await axios.post(`${process.env.LLM_URL}/generate`, context);
    res.write(`Generated Summary:\n${response.data.summary}\n`);

    return response.data.summary;

  } catch (error) {
    res.write("Error generating summary:\n" + error.message);
  }
};


module.exports = { scanWebsiteAndGeneratePDF };
