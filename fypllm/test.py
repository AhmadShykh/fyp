from flask import Flask, request, jsonify
import ollama
from g4f.client import Client
import time

app = Flask(__name__)


def generate_summary(tool_name, tool_output, explanation_type):
    context = f"""
    You are a cybersecurity expert helping to interpret {tool_name} results.
    Please explain the findings in a way that a non-technical user can understand and keep.
    Explain everything like you are directly providing a professional report. So don't use phrases like "Sure! Let's break down the Metasploit results in a
way that's easy to understand for someone without
a technical background."

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

    # Concatenate all summaries into a final report
    final_summary = f"""

    You are an AI assistant that summarizes customer data concisely. Given a row from a customer dataset, generate a short summary in natural language, highlighting key details like the customer's name, age, location, purchase behavior, and satisfaction level.

    Customer ID: 1001  
    Name: John Doe  
    Age: 32  
    Gender: Male  
    Email: john@example.com  
    Phone: 123-456-7890  
    Location: New York, USA  
    Purchase History: $2000 (5 orders)  
    Subscription Plan: Premium  
    Last Purchase Date: 2025-03-10  
    Feedback Score: 4.5  
    
    Generate a summary of this customer.



    """

    return jsonify({"summary": final_summary})


if __name__ == '__main__':
    app.run(host="localhost", port=11434)