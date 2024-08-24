#!/bin/bash

PROJ_DIR=`cd ${0%/*} && pwd -P`

echo &&
echo "Copying latest SVG file from project root." &&
echo &&

cd $PROJ_DIR/tools/svgEnhancer/

# Check if credentials.json exists before proceeding
if [ -f "credentials.json" ]; then
  echo "credentials.json found, proceeding with SVG enhancement."

  echo &&
  echo "Creating JSON data and enhanced SVG." &&
  echo &&

  npm ci &&
  npm start &&

  echo &&
  echo "Moving JSON data and Enhanced SVG into site project." &&
  echo &&

  mv -fv $PROJ_DIR/tools/svgEnhancer/out/* $PROJ_DIR/site/src/assets/

else
  echo "credentials.json not found, skipping SVG enhancement."
fi

cd $PROJ_DIR/site/

echo &&
echo "Building site." &&
echo &&

npm ci &&
npm run build &&

echo &&
echo "Finished building site." &&
echo
