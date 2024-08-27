## Dockerized Setup and Deployment

The application has been fully dockerized, with all dependencies managed within the Docker container. There's no need to install anything locally on your machine. Deployment is fully managed by Cloud Build and Cloud Run on GCP, requiring no manual steps beyond updating the Docker image.

### Credentials for Google Sheets API

When building the Dockerfile, it runs `./site-build.sh`, which requires a `credentials.json` (Google service account) to access the Google Sheets API. This file must be placed in:
```
/interactive-pathways(frontend_root)/tools/svgEnhancer/credentials.json
```

## Tools

We have a small collection of tools to process the SVG and create the JSON assets used on the site.

### `svgEnhancer`

This tool processes the [Google Sheet](https://docs.google.com/spreadsheets/d/1k8xIVzpx5aV839SHc-FzGTSHTDyLhYl8yVqyCjPj5ck/edit?gid=52046781#gid=52046781) that Tina edits, scrapes text data from the `map.svg`, and combines these into JSON assets and an enhanced `map.svg.inner.html` file.

### `reactionSheetReader`

This tool reads and processes data from our reaction sheet. Currently, it is not used for production data but may be utilized in future phases of the project.
