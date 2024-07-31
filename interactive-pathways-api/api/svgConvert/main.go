package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"interactive-pathways-api/lib"
	"io"
	"os"
	"os/exec"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type svgRequest struct {
	Svg string `json:"svg"`
}

type pngResponse struct {
	Png string `json:"png"`
}

type Request events.APIGatewayProxyRequest

func Handler(req Request) (events.APIGatewayProxyResponse, error) {
	svgJson := new(svgRequest)
	err := json.Unmarshal([]byte(req.Body), svgJson)
	if err != nil {
		return lib.SendError(err)
	}

	cmd := exec.Command("rsvg-convert", "-f", "png")
	stdin, err := cmd.StdinPipe()
	if err != nil {
		return lib.SendError(err)
	}
	cmd.Env = append(
		os.Environ(),
		"FONTCONFIG_PATH=./bin/assets",
	)

	go func() {
		defer stdin.Close()
		io.WriteString(stdin, svgJson.Svg)
	}()

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return lib.SendError(err)
	}

	if err := cmd.Start(); err != nil {
		return lib.SendError(err)
	}

	buf := new(bytes.Buffer)
	buf.ReadFrom(stdout)
	sEnc := base64.StdEncoding.EncodeToString([]byte(buf.String()))

	pngResponse := new(pngResponse)
	pngResponse.Png = "data:image/png;base64," + sEnc

	if err := cmd.Wait(); err != nil {
		return lib.SendError(err)
	}

	return lib.SendResponse(pngResponse)
}

func main() {
	lambda.Start(Handler)
}
