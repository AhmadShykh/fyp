from flask import Flask, request, jsonify
import ollama  # Requires 'pip install ollama'

app = Flask(__name__)

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    metasploit_output = data.get('metasploit_output', '')
    nmap_output = data.get('nmap_output', '')
    owasp_zap_output = data.get('owasp_zap_output', '')

    if not metasploit_output or not nmap_output or not owasp_zap_output:
        return jsonify({"error": "Please provide all required outputs: metasploit_output, nmap_output, owasp_zap_output."}), 400

    # Prepare the context for the model to interpret
    context = f"""
    You are a cybersecurity expert helping to interpret vulnerability assessment results.
    The following outputs are from different tools used to scan the website for security issues. Please explain the findings in a explained way, so a non-technical user can understand what is wrong with their website and where the issues are. 

    Metasploit Output:
    {metasploit_output}

    Nmap Output:
    {nmap_output}

    OWASP ZAP Output:
    {owasp_zap_output}

    Your task is to write your response in a way like we are generating a report on the vulnerabilities. First talk about the metasploit output in detail in the manner we discussed, then talk about the nmap output, then in the end explain each vulnerability from zap in the following format
    1. Explain the vulnerability 
    2. Its effects on the website 
    3. Solutions user can take to solve them.
    
    Please explain in non-technical language.
    """
    # Request the model to generate a summary based on the outputs
    response = ollama.chat(model='mistral', messages=[{"role": "user", "content": context}])

    return jsonify({"summary": response['message']['content']})


if __name__ == '__main__':
    app.run(host="localhost", port=8000)
