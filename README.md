# Interactive Pathways Project

This project consists of a fully dockerized frontend and backend application, deployed on Google Cloud Platform (GCP) using Cloud Build and Cloud Run. All dependencies are managed within the Docker containers, eliminating the need for local installations or environment setup. The GCP project name is `som-metabloic-pathways`.

Below is an overview of the setup, deployment, and important considerations.

### Directory Structure
- **`infrastucture/`**: No longer needed (can be removed).
- **`interactive-pathways/`**: Contains the frontend code (React).
- **`interactive-pathways-api/`**: Contains the backend code (Go).

### Docker Compose Configuration

The application is configured to run locally using Docker Compose. The `docker-compose.yml` file orchestrates both the frontend and backend services.

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./interactive-pathways
      dockerfile: Dockerfile
      args:
        - REACT_APP_API_URL=http://localhost:8888
        - REACT_APP_SVG_ENDPOINT=svgconvert
    ports:
      - "88:8080"
    depends_on:
      - backend

  backend:
    build:
      context: ./interactive-pathways-api
      dockerfile: Dockerfile
    ports:
      - "8888:8080"
    environment:
      - ENV_VAR_NAME=production
      - CORS_ORIGINS=http://localhost:88
```

### Ports

- **Frontend**: Default port is `88:8080`.
- **Backend**: Default port is `8888:8080`.

If you encounter port conflicts on your local machine, you can easily update the port mappings in the `docker-compose.yml` file. Simply change the ports under the respective service.  But remember to update the values for **`REACT_APP_API_URL`** and **`CORS_ORIGINS`** values:

```yaml
services:
  frontend:
    ports:
      - "your_new_port:8080"

  backend:
    ports:
      - "your_new_port:8080"
```


## Running Locally

After cloning the repository:

1. **Place `credentials.json`** (obtain from an admin) file into the appropriate location:

```
/interactive-pathways(frontend_root)/tools/svgEnhancer/credentials.json
```

2. **Check Ports:**
- Default ports: `88:8080` (frontend), `8888:8080` (backend).
- Adjust in `docker-compose.yml` if needed.

3. **Build and Start (from root):**

  ```sh
  docker-compose build
  docker-compose up
  ```
Access the frontend at [http://localhost:88](http://localhost:88).



## Deployment

Deployment is handled through Cloud Build and Cloud Run on GCP. The cloud build process is triggered by the cloudbuild.yaml files located in both the frontend and backend directories. These YAML files define the steps to build, push, and deploy the Docker images.

To trigger a build, simply commit and push a change to this repository. The Cloud Build process will automatically detect the changes and initiate the build and deployment process.


## GCP Notes

### Secret Manager Integration

- The frontend build process requires a `credentials.json` file for Google Sheets API access. This file is securely retrieved from Google Secret Manager and automatically placed in the appropriate location during the build process, as defined in the `cloudbuild.yaml` file.

### CORS Management

- The backend code manages CORS settings, with allowed URLs controlled via build arguments. These are configured in the `cloudbuild.yaml` file for production and the `Docker Compose` file for local development.
- Once the frontend receives its proper domain name (e.g., interactive-pathways.stanford.edu), ensure the `cloudbuild.yaml` file is updated to include the new URL.

