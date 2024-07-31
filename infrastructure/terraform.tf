provider "aws" {
  region = "us-west-2"
  profile = "cardinal"
}

data "aws_region" "current" {}

resource "aws_s3_bucket" "inter-pathways-bucket" {
  bucket = var.bucket_name
  acl    = "private"
  tags = {
    Name = "Interactive Pathways Bucket"
  }
}

resource "aws_s3_bucket_public_access_block" "inter-pathways-bucket" {
  bucket = aws_s3_bucket.inter-pathways-bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_website_configuration" "inter-pathways-bucket" {
  bucket = aws_s3_bucket.inter-pathways-bucket.bucket

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_policy" "inter-pathways-bucket" {
  bucket = aws_s3_bucket.inter-pathways-bucket.id
  policy = templatefile("s3-policy.json", { bucket = aws_s3_bucket.inter-pathways-bucket.id })
}

resource "aws_lambda_layer_version" "lambda_layer" {
  filename   = "lambda-layers/rsvg-convert.zip"
  layer_name = "rsvg-convert"

  compatible_runtimes = ["go1.x"]
}

output "inter_pathways_bucket" {
  value = aws_s3_bucket.inter-pathways-bucket.bucket
}

output "inter_pathways_lambda_layer" {
  value = aws_lambda_layer_version.lambda_layer.arn
}
