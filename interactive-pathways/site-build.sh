#!/bin/bash

PROJ_DIR=`cd ${0%/*} && pwd -P`

echo "Copying latest SVG file from project root."

cd $PROJ_DIR/tools/svgEnhancer/

echo "Creating JSON data and enhanced SVG."

npm ci
npm start

echo "Moving JSON data and Enhanced SVG into site project."

mv -fv $PROJ_DIR/tools/svgEnhancer/out/* $PROJ_DIR/site/src/assets/

cd $PROJ_DIR/site/

echo "Building site."

npm ci
npm run build

echo "Finished building site."
