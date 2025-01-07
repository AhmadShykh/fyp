const axios = require("axios");
require("dotenv").config();

// VM Server Configuration
const VM_IP = process.env.VM_IP || "127.0.0.1"; // IP address of the VM
const VM_PORT = process.env.VM_PORT || 3000; // Port where the VM server is running
const VM_SERVER_BASE_URL = `http://${VM_IP}:${VM_PORT}`; // Base URL for the VM server

// Scan Controller
const scanWebsite = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "URL is required." });
  }

  try {
    // Initiate Metasploit Scan
    res.write("Starting Metasploit Scan...\n");
    const metasploitResponse = await axios.post(`${VM_SERVER_BASE_URL}/scan`, {
      url,
      tool: "metasploit",
    });
    res.write("Metasploit Scan Completed:\n");
    res.write(`${JSON.stringify(metasploitResponse.data)}\n\n`);

    // Initiate Nmap Scan
    res.write("Starting Nmap Scan...\n");
    const nmapResponse = await axios.post(`${VM_SERVER_BASE_URL}/scan`, {
      url,
      tool: "nmap",
    });
    res.write("Nmap Scan Completed:\n");
    res.write(`${JSON.stringify(nmapResponse.data)}\n\n`);

    // Initiate ZAP Baseline Scan
    res.write("Starting ZAP Baseline Scan...\n");
    const zapResponse = await axios.post(`${VM_SERVER_BASE_URL}/scan`, {
      url,
      tool: "zap",
    });
    res.write("ZAP Baseline Scan Completed:\n");
    res.write(`${JSON.stringify(zapResponse.data)}\n\n`);

    // End the response
    res.end("All scans completed successfully.\n");
  } catch (error) {
    console.error("Error during scan:", error.message);
    res.write("Error during scan:\n");
    res.write(`${error.message}\n`);
    res.write(`${error.response?.data || "No additional details"}\n`);
    res.end();
  }
};

module.exports = { scanWebsite };
