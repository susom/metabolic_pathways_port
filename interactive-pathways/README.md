# Up and Running

## Install

### node.js

Mac homebrew install
```sh
brew install node
```
https://nodejs.org/en/download/package-manager/#macos

*Recommended install via NVM*
```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash

nvm install node
```
https://github.com/nvm-sh/nvm#install-script

## Build site
This generates all site assets from the Google sheet and `map.svg` file. Also creates a production site in `app/public`.
```sh
./site-build.sh
```

## Run project

### Start local site
```sh
./site-build.sh
cd site/
npm start
```

### Install packages (if needed)
```sh
npm ci
```

# Tools
We have a small collection of tools to process the SVG and create the JSON assets we're using on the site. Removed unused tools, see commit ID db447e1 to see them.

## `svgEnhancer`
This tool processes the Google sheets that Tina edits, scrapes text data from the `map.svg`, and combines these into JSON assets and an enhanced `map.svg.inner.html` file.
```sh
cd tools/svgEnhancer
node index.js
```

## `reactionSheetReader`
This tool reads and processes data from our reaction sheet. Currently, we aren't using this tool for any production data, but we may use it in future phases of the project.
```sh
cd tools/reactionSheetReader
node index.js
```

# Testing
