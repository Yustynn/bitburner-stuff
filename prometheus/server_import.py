from flask import Flask, request, jsonify
import json

PORT = 2139
OUTPUT_FILENAME = 'data.json'

app = Flask(__name__)

@app.route('/save', methods=['POST'])
def save_to_file():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid data"}), 400
    
    try:
        with open(OUTPUT_FILENAME, 'w') as file:
            json.dump(data, file, indent=4)
        return jsonify({"message": "Data saved successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=PORT)