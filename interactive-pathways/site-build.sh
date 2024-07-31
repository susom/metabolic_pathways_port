#!/bin/bash

PROJ_DIR=`cd ${0%/*} && pwd -P`

echo &&
echo "Copying latest SVG file from project root." &&
echo &&

cd $PROJ_DIR/tools/svgEnhancer/ &&
# for complete automation put `credentials.json` and `token.json` here.
# svgEnhancer won't work without these files from the google sheet API.
# Probably should copy from S3 bucket.

echo &&
echo "Creating JSON data and enhanced SVG." &&
echo &&

npm ci &&
npm start &&

echo &&
echo "Moving JSON data and Enhanced SVG into site project." &&
echo &&

mv -fv $PROJ_DIR/tools/svgEnhancer/out/* $PROJ_DIR/site/src/assets/ &&

cd $PROJ_DIR/site/ &&

echo &&
echo "Building site." &&
echo &&

npm ci &&
npm run build &&

echo &&
echo "Finished building site." &&
echo
