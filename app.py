import json
import sys
sys.dont_write_bytecode = True

from flask import Flask, request, jsonify
import database  # Ensure this is your database.py file

app = Flask(__name__)

@app.route('/insert', methods=['POST'])
def insert():
    # print("insert")
    data = request.json

    # print(data.get('password'))
    # print(data.get('iv'))

    arrayPassword = bytearray(data.get('password'))
    arrayIv = bytearray(data.get('iv'))

    print(arrayPassword)
    print(arrayIv)
    
    database.insert_username_password(data['username'], arrayPassword, arrayIv, data['website'])
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
