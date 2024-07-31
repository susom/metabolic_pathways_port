variable "aws_region" {
  description = "The AWS region to provision resources in."
  type        = string
  default     = "us-west-2"
}

variable "aws_account_id" {
  description = "The AWS account id."
  type        = string
  default     = ""
}

variable "env" {
  description = "The environment name"
}

variable "terraform_state_bucket" {
  description = "Terraform state bucket."
  type        = string
  default     = "scpd-terraform-project-state-bucket"
}

variable "bucket_name" {
  description = "Bucket name."
  type        = string
  default     = "interactivepathways.stanford.edu"
}
