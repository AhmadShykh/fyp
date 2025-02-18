const express = require("express");
const { exec } = require("child_process");
const app = express();
const fs = require("fs");
const path = require("path");

app.use(express.json());

// Utility function to extract hostname or IP from a URL
const extractHostname = (url) => {
  try {
    return new URL(url).hostname; // Extracts hostname from the URL
  } catch (err) {
    return url; // If it's not a valid URL, return it as-is
  }
};

// Scan API Endpoint
app.post("/scan", async (req, res) => {
  const { url, tool } = req.body;

  if (!url || !tool) {
    return res.status(400).json({ message: "URL and tool are required." });
  }

  try {
    if (tool === "zap") {
      // Define the file path
      const reportPath = path.join(process.cwd(), "baseline-report.json");

      // Run ZAP Baseline Scan in a Docker Container
      const zapCommand = `
        docker run --privileged -v $(pwd):/zap/wrk/:rw -t zaproxy/zap-stable zap-baseline.py \
        -t ${url} \
        -J baseline-report.json
      `;

      exec(zapCommand, (error, stdout, stderr) => {
      
        if (error) {
          if(error.code != 2 && error.code != 1)
          {
             console.error(`ZAP Baseline Scan Error: ${error.message}`);
              return res.status(500).json({
              message: "Error running ZAP Baseline Scan",
              error: error.message,
             });
          }
          
        }

        console.log(`ZAP Baseline Scan Output:\n${stdout}`);

        // Read the JSON file and return its contents
        fs.readFile(reportPath, "utf8", (err, data) => {
          if (err) {
            console.error(`Error reading JSON report: ${err.message}`);
            return res.status(500).json({
              message: "Error reading ZAP Baseline Scan JSON report",
              error: err.message,
            });
          }

          try {
            const jsonData = JSON.parse(data);
            return res.status(200).json({results:stdout, json_data: jsonData});
          } catch (parseError) {
            console.error(`Error parsing JSON report: ${parseError.message}`);
            return res.status(500).json({
              message: "Error parsing ZAP Baseline Scan JSON report",
              error: parseError.message,
            });
          }
        });
      });
    } else if (tool === "nmap") {
      // Extract the hostname or IP for Nmap
      const sanitizedUrl = extractHostname(url);

      // Trigger Nmap Scan
      exec(`nmap -Pn ${sanitizedUrl}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Nmap Error: ${error.message}`);
          return res.status(500).json({ message: "Error running Nmap", error: error.message });
        }

        console.log(`Nmap Scan Output:\n${stdout}`);
        return res.status(200).json({ tool: "nmap", results: stdout });
      });
    } else if (tool === "metasploit") {
      // Trigger Metasploit (Example: msfconsole)
      exec(`msfconsole -q -x "use auxiliary/scanner/http/http_version; set RHOSTS ${url}; run; exit"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Metasploit Error: ${error.message}`);
          return res.status(500).json({ message: "Error running Metasploit", error: error.message });
        }

        console.log(`Metasploit Scan Output:\n${stdout}`);
        return res.status(200).json({ tool: "metasploit", results: stdout });
      });
    } else {
      return res.status(400).json({ message: "Unsupported tool." });
    }
  } catch (error) {
    console.error(`Error running scan: ${error.message}`);
    return res.status(500).json({ message: "Error running scan", error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0"; // Listen on all network interfaces
app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}`));

