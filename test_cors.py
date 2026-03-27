import re
from flask import Flask
from flask_cors import CORS
app = Flask(__name__)
origins = [
    "https://wavemusic-six.vercel.app",
    "http://localhost:5173",
    re.compile(r"https?://(127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?")
]
try:
    CORS(app, supports_credentials=True, origins=origins)
    print("CORS initialized successfully")
except Exception as e:
    print("Error:", e)
