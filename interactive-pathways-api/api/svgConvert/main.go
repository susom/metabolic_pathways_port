package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"io"
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
	var svgJson svgRequest
	err := json.NewDecoder(r.Body).Decode(&svgJson)
	if err != nil {
		http.Error(w, "Failed to parse request body", http.StatusBadRequest)
		return
	}

	cmd := exec.Command("rsvg-convert", "-f", "png")
	stdin, err := cmd.StdinPipe()
	if err != nil {
		http.Error(w, "Failed to create stdin pipe", http.StatusInternalServerError)
		return
	}
	cmd.Env = append(os.Environ(), "FONTCONFIG_PATH=./bin/assets")

	go func() {
		defer stdin.Close()
		io.WriteString(stdin, svgJson.Svg)
	}()

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		http.Error(w, "Failed to create stdout pipe", http.StatusInternalServerError)
		return
	}

	if err := cmd.Start(); err != nil {
		http.Error(w, "Failed to start command", http.StatusInternalServerError)
		return
	}

	buf := new(bytes.Buffer)
	buf.ReadFrom(stdout)
	sEnc := base64.StdEncoding.EncodeToString(buf.Bytes())

	if err := cmd.Wait(); err != nil {
		http.Error(w, "Failed to wait for command completion", http.StatusInternalServerError)
		return
	}

	pngResp := pngResponse{
		Png: "data:image/png;base64," + sEnc,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(pngResp)
}

func main() {
	http.HandleFunc("/svgconvert", handler)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	http.ListenAndServe(":"+port, nil)
}
