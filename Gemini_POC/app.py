from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests
import json

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# Load access token (assumes already authenticated)
with open('access_token.txt', 'r') as file:
    access_token = file.readline().strip()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/submit', methods=['POST'])
def submit():
    data = request.get_json()
    
    # Clean inputs
    full_name = data.get('full_name', '').strip().title()
    country = data.get('country', '').strip().upper()
    dob = data.get('dob', '').strip()
    city = data.get('city', '').strip().title()

    # SAS ID module scoring endpoint
    url_sas = "https://create.demo.sas.com/microanalyticScore/modules/gemini_poc1_0/steps/execute"

    payload = json.dumps({
        "version": 1.0,
        "inputs": [
            {"name": "Input_Country_", "value": country},
            {"name": "Input_DOB_", "value": dob},
            {"name": "Input_Name_", "value": full_name},
            {"name": "Input_City_", "value": city}
        ]
    })

    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.sas.microanalytic.module.step.output+json',
        'Authorization': f'Bearer {access_token}'
    }

    try:
        response = requests.post(url_sas, headers=headers, data=payload)
        response.raise_for_status()
        result = response.json()
        return jsonify({ "sas_response": result })
    except Exception as e:
        return jsonify({ "error": str(e) }), 500

if __name__ == '__main__':
    app.run(debug=True)
