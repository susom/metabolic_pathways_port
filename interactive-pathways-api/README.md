# Up and Running

## Where to put the project
Put the project in `$GOPATH/src`

## Install
### go
```sh
brew install go
```
- https://golang.org/doc/install

### node.js
```sh
brew install node
```
- https://nodejs.org/en/

### dep
```sh
brew install dep #on macOS
sudo apt-get install go-dep #on debian
```
- https://github.com/golang/dep

### serverless
```sh
npm install -g serverless
```
- https://serverless.com/framework/docs/providers/aws/guide/quick-start/

### Install/Configure AWS CLI
- https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
- https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html

*Optionally*, you can use `serverless` to setup AWS for you, but *I recommend using the AWS CLI*. See video below for using `serverless` to set it up.
- https://www.youtube.com/watch?v=KngM5bfpttA

### Create rsvg layer
Follow the instructions in the repo below to create a lambda layer, and put the ARN of this layer in the the respective prod/dev config file.
- https://github.com/serverlesspub/rsvg-convert-aws-lambda-binary

# Run
Inside the project's `src/api` directory.

## Build
```sh
make build
```

## Clean
```sh
make clean
```

## Deploy
```sh
sls deploy -v --stage dev # development AWS
sls deploy -v --stage prod # production AWS
```
