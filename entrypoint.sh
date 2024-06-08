#!/bin/sh

# Apply database migrations
flask db upgrade --directory=/app/backend/migrations

while true; do
    python3 backend/compute_results.py
    sleep 3600
done &

# Start the Flask application
#flask run --host=0.0.0.0

# Prob not the best idea to listen on all hosts but fine with container app
gunicorn -w 1 -b 0.0.0.0:5000 --pythonpath backend app:app
