// Get date from another state file
data "terraform_remote_state" "route53-state" {
  backend = "s3"
  config = {
    bucket  = var.terraform_state_bucket
    key     = "route53.tfstate"
    region  = var.aws_region
    profile = "cardinal"
  }
}

// Store terraform state on AWS. The S3 bucket should be created before running terraform
terraform {
  backend "s3" {
    bucket  = "scpd-terraform-project-state-bucket"
    key     = "interactivepathways.tfstate"
    region  = "us-west-2"
    profile = "cardinal"
  }
}
