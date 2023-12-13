import sys
sys.dont_write_bytecode = True

from flask import Flask, request, jsonify
import database  # Ensure this is your database.py file

app = Flask(__name__)

@app.route('/insert', methods=['POST'])
def insert():
    data = request.json
    database.insert_username_password(data['username'], data['password'], data['website'])
    return jsonify({"status": "success"}), 200

@app.route('/delete', methods=['DELETE'])
def delete():
    row_id = request.args.get('row_id')
    database.delete_username_password(row_id)
    return jsonify({"status": "success"}), 200

if __name__ == '__main__':
    app.run(debug=True)