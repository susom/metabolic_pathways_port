package lib

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/aws/aws-lambda-go/events"
)

var headers = map[string]string{
	"Access-Control-Allow-Origin": os.Getenv("CORS_ALLOW_ORIGIN"),
	"Content-Type":                "application/json",
}

// Add a helper for handling errors. This logs any error to os.Stderr
// and returns a 500 Internal Server Error response that the AWS API
// Gateway understands.
func SendError(err error) (events.APIGatewayProxyResponse, error) {
	fmt.Println(err)
	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusInternalServerError,
		Body:       err.Error(),
		Headers:    headers,
	}, nil
}

func SendResponse(data interface{}) (events.APIGatewayProxyResponse, error) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return SendError(err)
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Body:       string(jsonData),
		Headers:    headers,
	}, nil
}
