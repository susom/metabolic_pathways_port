## Dockerized Setup and Deployment

The backend application was originally an AWS Lambda function written in Go. It has been fully dockerized and migrated to Google Cloud Platform (GCP), where it is deployed using Cloud Build and Cloud Run. All dependencies are managed within the Docker container, and there is no need for local installations.

### `rsvg-convert` 

The backend relies on the rsvg-convert tool for SVG processing. This tool is installed as part of the Docker build process using the librsvg2-bin package from the Debian package repository. No additional setup is required beyond ensuring the Docker image is built correctly.