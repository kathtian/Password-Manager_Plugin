import sys
sys.dont_write_bytecode = True

from flask import Flask, request, jsonify
from flask_cors import CORS
import database  # Ensure this is your database.py file

app = Flask(__name__)
CORS(app)

@app.route('/insert', methods=['POST'])
def insert():
    data = request.json
    database.insert_username_password(data['username'], data['password'], data['iv'], data['website'])
    return jsonify({"status": "success"}), 200

@app.route('/delete', methods=['DELETE'])
def delete():
    row_id = request.args.get('row_id')
    database.delete_username_password(row_id)
    return jsonify({"status": "success"}), 200

@app.route('/get', methods=['GET'])
def get_credentials():
    website = request.args.get('website')
    credentials= database.get_username_password_by_website(website)
    if credentials:
        return jsonify(credentials), 200
    else:
        return jsonify({"status": "not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
