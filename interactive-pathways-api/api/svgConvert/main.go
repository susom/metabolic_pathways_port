package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
)

type svgRequest struct {
	Svg string `json:"svg"`
}

type pngResponse struct {
	Png string `json:"png"`
}

func handler(w http.ResponseWriter, r *http.Request) {
    log.Println("Received request to /svgconvert")

    var svgJson svgRequest
    err := json.NewDecoder(r.Body).Decode(&svgJson)
    if err != nil {
        log.Printf("Error parsing request body: %v", err)
        http.Error(w, "Failed to parse request body", http.StatusBadRequest)
        return
    }

    // Log the received SVG data
    log.Printf("SVG Data Received: %s", svgJson.Svg)

    cmd := exec.Command("rsvg-convert", "-f", "png")
    stdin, err := cmd.StdinPipe()
    if err != nil {
        log.Printf("Error creating stdin pipe: %v", err)
        http.Error(w, "Failed to create stdin pipe", http.StatusInternalServerError)
        return
    }
    cmd.Env = append(os.Environ(), "FONTCONFIG_PATH=./bin/assets")

    go func() {
        defer stdin.Close()
        log.Println("Writing SVG data to stdin")
        _, err := io.WriteString(stdin, svgJson.Svg)
        if err != nil {
            log.Printf("Error writing to stdin: %v", err)
        }
    }()

    stdout, err := cmd.StdoutPipe()
    if err != nil {
        log.Printf("Error creating stdout pipe: %v", err)
        http.Error(w, "Failed to create stdout pipe", http.StatusInternalServerError)
        return
    }

    if err := cmd.Start(); err != nil {
        log.Printf("Error starting command: %v", err)
        http.Error(w, "Failed to start command", http.StatusInternalServerError)
        return
    }

    log.Println("Reading command output")
    buf := new(bytes.Buffer)
    buf.ReadFrom(stdout)
    sEnc := base64.StdEncoding.EncodeToString(buf.Bytes())

    if err := cmd.Wait(); err != nil {
        log.Printf("Error waiting for command completion: %v", err)
        http.Error(w, "Failed to wait for command completion", http.StatusInternalServerError)
        return
    }

    pngResp := pngResponse{
        Png: "data:image/png;base64," + sEnc,
    }

    log.Println("Encoding and sending response")
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(pngResp)
}

func main() {
	http.HandleFunc("/svgconvert", handler)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Starting server on port %s", port)
	http.ListenAndServe(":"+port, nil)
}
