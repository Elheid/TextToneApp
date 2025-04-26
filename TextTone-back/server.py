# server.py
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.text import tokenizer_from_json
from tensorflow.keras.preprocessing.sequence import pad_sequences
import json
import numpy as np

import os
script_dir = os.path.dirname(os.path.abspath(__file__))
tokenizer_path = os.path.join(script_dir, 'tokenizer_sentiment.json')

model_path = os.path.join(script_dir, 'model.keras')


app = Flask(__name__)
CORS(app)  # Разрешаем CORS для всех доменов

# Загрузка модели и токенизатора при старте сервера
with open(tokenizer_path, 'r', encoding='utf-8') as f:
    tokenizer = tokenizer_from_json(json.load(f))

model = load_model(model_path)
max_len = 500
labels = ['negative', 'neutral', 'positive']

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        text = data.get('text', '')
        
        # Преобразование текста в последовательность
        sequence = tokenizer.texts_to_sequences([text])
        padded = pad_sequences(sequence, maxlen=max_len, padding='post', truncating='post')
        
        # Предсказание
        prediction = model.predict(padded)
        #result = labels[prediction.argmax(axis=1)[0]]
        label_map = {
            0: "negative",
            1: "neutral",
            2: "positive"
        }
        predicted_labels = np.argmax(prediction, axis=1)
        result = [label_map[label] for label in predicted_labels]
        return jsonify({'sentiment': result})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)