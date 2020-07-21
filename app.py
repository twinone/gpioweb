from flask import Flask, jsonify, abort, send_from_directory, redirect
from flask_cors import CORS
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
cors = CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")