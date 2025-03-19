from flask import Flask, request, jsonify
import ollama
from g4f.client import Client
import time

app = Flask(__name__)


def generate_summary(tool_name, tool_output, explanation_type):
    context = f"""
    You are a cybersecurity expert helping to interpret {tool_name} results.
    Please explain the findings in a way that a non-technical user can understand.

    {tool_name} Output:
    {tool_output}

    Your task is to write the response in a well-structured manner based on the tool:

    - **Metasploit Output:** Explain the vulnerabilities detected, their impact, and how to fix them.
    - **Nmap Output:** Explain open ports, their security risks, and provide recommendations for securing them.
    - **OWASP ZAP Output:** Provide a detailed analysis of each test (both pass and fail). For failed tests, explain the vulnerability, its effects, and step-by-step solutions in a non-technical manner.

    Please use simple, non-technical language to ensure clarity.
    """

    client = Client()
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": context}],
        web_search=False
    )

    return response.choices[0].message.content


@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    metasploit_output = data.get('metasploit_output', '')
    nmap_output = data.get('nmap_output', '')
    owasp_zap_output = data.get('owasp_zap_output', '')

    if not metasploit_output or not nmap_output or not owasp_zap_output:
        return jsonify(
            {"error": "Please provide all required outputs: metasploit_output, nmap_output, owasp_zap_output."}), 400

    # Generate summaries separately
    metasploit_summary = generate_summary("Metasploit", metasploit_output, "vulnerability_explanation")
    time.sleep(2)  # Prevent rate-limiting issues

    nmap_summary = generate_summary("Nmap", nmap_output, "port_security")
    time.sleep(2)

    zap_summary = generate_summary("OWASP ZAP", owasp_zap_output, "detailed_test_analysis")

    # Concatenate all summaries into a final report
    final_summary = f"""

    ** Metasploit Analysis **

    {metasploit_summary}



    ** Nmap Analysis **
    
    {nmap_summary}

    ** OWASP ZAP Analysis **

    {zap_summary}




    """

    return jsonify({"summary": final_summary})


if __name__ == '__main__':
    app.run(host="localhost", port=8000)