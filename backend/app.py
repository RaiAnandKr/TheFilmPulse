from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__, static_folder='../frontend/build',static_url_path='/')
CORS(app)

@app.route("/")
def hello_world():
  """A simple route returning a message"""
  return jsonify({"message": "Hello from your Flask Backend!"})

if __name__ == "__main__":
  app.run(debug=True)
