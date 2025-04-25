const express = require("express");
const { exec } = require("child_process");
const app = express();
const fs = require("fs");
const path = require("path");

app.use(express.json());

// Utility to extract hostname/IP from URL
const extractHostname = (url) => {
  try {
    return new URL(url).hostname;
  } catch (err) {
    return url;
  }
};

// Metasploit Scans by Plan
const metasploitScans = {
  free: [
    'use auxiliary/scanner/http/http_version; set RHOSTS'
  ],
  advanced: [
    'use auxiliary/scanner/http/http_version; set RHOSTS',
    'use auxiliary/scanner/http/apache_optionsbleed; set RHOSTS',
    'use auxiliary/scanner/http/wordpress_xmlrpc_login; set RHOSTS',
    'use auxiliary/scanner/http/joomla_http_header; set RHOSTS'
  ],
  premium: [
    'use auxiliary/scanner/http/http_version; set RHOSTS',
    'use auxiliary/scanner/http/apache_optionsbleed; set RHOSTS',
    'use auxiliary/scanner/http/wordpress_xmlrpc_login; set RHOSTS',
    'use auxiliary/scanner/http/joomla_http_header; set RHOSTS',
    'use auxiliary/scanner/http/cisco_ssl_vpn; set RHOSTS',
    'use auxiliary/scanner/http/dlink_dir_300_600_exec; set RHOSTS',
    'use auxiliary/scanner/http/php_cgi_arg_injection; set RHOSTS',
    'use auxiliary/scanner/http/git_config; set RHOSTS'
  ]
};

// Scan API Endpoint
app.post("/scan", async (req, res) => {
  const { url, tool, plan = "free" } = req.body;

  if (!url || !tool) {
    return res.status(400).json({ message: "URL and tool are required." });
  }

  try {
    if (tool === "zap") {
      const reportPath = path.join(process.cwd(), "zap-report.json");
      const zapContainerName = "zap-scanner";
      const zapScanScript = plan === "premium"
        ? `zap-full-scan.py -t ${url} -J zap-report.json`
        : `zap-baseline.py -t ${url} -J zap-report.json`;

      const zapCommand = `
        if [ "$(docker ps -a -q -f name=${zapContainerName})" ]; then
          if [ ! "$(docker ps -q -f name=${zapContainerName})" ]; then
            docker start ${zapContainerName};
          fi
        else
          docker run --user root -d --name ${zapContainerName} --privileged -v $(pwd):/zap/wrk/:rw -t zaproxy/zap-stable;
        fi
        docker exec ${zapContainerName} ${zapScanScript}
      `;

      exec(zapCommand, (error, stdout, stderr) => {
        if (error && error.code !== 2 && error.code !== 1) {
          console.error(`ZAP Scan Error: ${error.message}`);
          return res.status(500).json({ message: "Error running ZAP scan", error: error.message });
        }

        fs.readFile(reportPath, "utf8", (err, data) => {
          if (err) {
            return res.status(500).json({ message: "Error reading ZAP report", error: err.message });
          }

          try {
            const jsonData = JSON.parse(data);
            console.log(`Zap Scan Output:\n${stdout}`);
            return res.status(200).json({ results: stdout, json_data: jsonData });
          } catch (parseError) {
            return res.status(500).json({ message: "Error parsing ZAP JSON", error: parseError.message });
          }
        });
      });

    } else if (tool === "nmap") {
      const sanitizedUrl = extractHostname(url);
      exec(`nmap -Pn ${sanitizedUrl}`, (error, stdout) => {
        if (error) {
          return res.status(500).json({ message: "Error running Nmap", error: error.message });
        }
        console.log(`Nmap Scan Output:\n${stdout}`);
        return res.status(200).json({ tool: "nmap", results: stdout });
      });

    } else if (tool === "metasploit") {
      const modules = metasploitScans[plan] || metasploitScans["free"];
      const commands = modules.map(cmd => `${cmd} ${url}; run;`).join(" ") + "exit";

      exec(`msfconsole -q -x "${commands}"`, (error, stdout) => {
        if (error) {
          return res.status(500).json({ message: "Error running Metasploit", error: error.message });
        }
        console.log(`Metasploit Scan Output:\n${stdout}`);
        return res.status(200).json({ tool: "metasploit", results: stdout });
      });

    } else {
      return res.status(400).json({ message: "Unsupported tool." });
    }

  } catch (error) {
    return res.status(500).json({ message: "Unexpected scan error", error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";
app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}`));

