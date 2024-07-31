bucket = interactivepathways.stanford.edu


infra:
	terraform apply


deploy:
	aws s3 cp ./src/ s3://$(bucket)/ --recursive --profile=cardinal