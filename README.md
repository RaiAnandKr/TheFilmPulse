# TheFilmPulse

For local testing,
Run the following command to build the Docker image for the backend
docker build -f Dockerfile_b . -t backend
Run the following command to build the Docker image for the frontend:
docker build -f Dockerfile_f . -t frontend

Start the containers
docker run -p 5000:5000 backend
docker run -p 8080:80 frontend

Access in your browser
http://localhost:5000 - for backend
http://localhost:8080 - for frontend
