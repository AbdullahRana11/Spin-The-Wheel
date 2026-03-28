from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

@app.route('/api/spin', methods=['POST'])
def spin():
    data = request.json
    options = data.get('options', [])
    
    if not options:
        return jsonify({"error": "No options provided"}), 400
    
    selected_index = random.randint(0, len(options) - 1)
    selected_option = options[selected_index]
    
    return jsonify({
        "index": selected_index,
        "option": selected_option
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
