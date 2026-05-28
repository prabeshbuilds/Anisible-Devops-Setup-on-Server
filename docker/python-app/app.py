import os

from flask import Flask, jsonify


app = Flask(__name__)


@app.get("/")
def index():
    return jsonify(service="python-app", status="ok")


@app.get("/health")
def health():
    return jsonify(status="healthy")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="0.0.0.0", port=port)
