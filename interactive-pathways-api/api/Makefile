
usage = make deploy env=prod/dev

ifndef env
$(error env arg is not set. Usage: $(usage))
endif

ifneq ($(env),$(filter $(env),prod dev))
$(error Environment value is not correct. Use production or staging instead.)
endif

.PHONY: build clean deploy

build:
	env GOOS=linux go build -ldflags="-s -w" -o bin/svgConvert svgConvert/main.go
	cp -fR assets ./bin/

clean:
	rm -rf ./bin

deploy: clean build
	sls deploy --verbose --stage $(env)
