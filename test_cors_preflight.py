import requests
from flask import Flask
from multiprocessing import Process
import time
import os

app = Flask(__name__)
from flask_cors import CORS
import re

allowed_origins = ["https://wavemusic-six.vercel.app", "http://localhost:5173", "http://127.0.0.1:5173"]
cors_origins = [
    *allowed_origins,
    re.compile(r"^https?://(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?$")
]

CORS(app, supports_credentials=True, origins=cors_origins)

@app.route('/api/auth/login', methods=['POST'])
def login():
    return "OK"

def run_server():
    app.run(port=5005, debug=False)

if __name__ == '__main__':
    p = Process(target=run_server)
    p.start()
    time.sleep(2)

    print("Testing Preflight Request from Vercel Origin...")
    headers = {
        "Origin": "https://wavemusic-six.vercel.app",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type"
    }
    r = requests.options("http://localhost:5005/api/auth/login", headers=headers)
    print("Response Status:", r.status_code)
    print("Access-Control-Allow-Origin:", r.headers.get("Access-Control-Allow-Origin"))
    print("Access-Control-Allow-Credentials:", r.headers.get("Access-Control-Allow-Credentials"))

    print("\nTesting Invalid Origin...")
    bad_headers = {
        "Origin": "https://malicious-site.com",
        "Access-Control-Request-Method": "POST"
    }
    r2 = requests.options("http://localhost:5005/api/auth/login", headers=bad_headers)
    print("Response Status:", r2.status_code)
    print("Access-Control-Allow-Origin:", r2.headers.get("Access-Control-Allow-Origin"))

    p.terminate()
