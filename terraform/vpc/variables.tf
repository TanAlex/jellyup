variable "namespace" {
  description = "Customer Namespace."
  default     = ""
}

variable "aws_region" {
  description = "AWS region."
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment."
}

variable "tags" {
  description = "tags to propogate to all supported resources"
  type        = "map"
  default = {
    "Name" = "onica"
  }
}

variable "vpc_cidr" {
    type    = "map"
    description = "CIDR associated with the VPC to be created"
    default = {
      "prod" = "10.1.0.0/18"
      "stage" = "10.2.0.0/18"
      "shared" = "10.3.0.0/18"
      "master" = "10.4.0.0/18"
    }
}

variable "tgw_cidr" {
  type    = "string"
  default = "10.0.0.0/8"
}

variable "az_count" {
  description = "the number of AZs to deploy infrastructure to"
  default     = 3
}

variable "enable_public_subnets" {
  type    = "string"
  default = "true"
}

variable "enable_private_subnets" {
  type    = "string"
  default = "true"
}

variable "enable_protected_subnets" {
  type    = "string"
  default = "true"
}

variable "enable_tgw_route" {
    type    = "map"
    description = "Add Transit Gateway Route"
    default = {
      "prod"" = "true"
      "stage"" = "true"
      "shared"" = "true"
      "master"" = "true"
    }
}
