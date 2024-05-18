# TheFilmPulse

For local testing,\
Run the following command to build the Docker image for the backend:\
docker build -f Dockerfile_b . -t backend\
\
Start the backend containers\
docker run -p 5000:5000 backend\
\
For frontend (go to the frontend directory)\
npm install
npm run dev\
\
Access in your browser\
http://localhost:5000 - for backend\
http://localhost:3000 - for frontend
