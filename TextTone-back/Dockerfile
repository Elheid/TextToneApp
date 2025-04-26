# backend/Dockerfile
FROM python:3.10-slim

WORKDIR /app

# Устанавливаем системные зависимости для TensorFlow
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "server:app"]