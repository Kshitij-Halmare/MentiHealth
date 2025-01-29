from flask import Flask, jsonify, request
from flask_cors import CORS
from transformers import pipeline
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from React app

# Initialize Hugging Face API Key (although we are using the model locally, you can still set it)
huggingface_api_key = os.getenv("HUGGINGFACEHUB_API_TOKEN")
os.environ["HUGGINGFACEHUB_API_TOKEN"] = huggingface_api_key

# Load the Hugging Face model using transformers
model_name = "Qwen/QwQ-32B-Preview"  # Or the model you want to use
generator = pipeline("text-generation", model=model_name)

@app.route('/api/respond', methods=['POST'])
def respond():
    user_input = request.json.get('input')
    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    # Generate a response using the model
    response = generator(user_input, max_length=120, num_return_sequences=1)

    return jsonify({"response": response[0]['generated_text']})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
