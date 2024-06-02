#!/bin/sh

# Apply database migrations
flask db upgrade --directory=/app/backend/migrations

# Start the Flask application
flask run --host=0.0.0.0
