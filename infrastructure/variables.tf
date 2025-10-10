# Variables for ComplianceX infrastructure

variable "project_name" {
  description = "The name of the project"
  type        = string
  default     = "compliancex"
}

variable "environment" {
  description = "The environment (dev, staging, prod)"
  type        = string
}

variable "location" {
  description = "The Azure region where resources will be created"
  type        = string
  default     = "westeurope"
}

variable "common_tags" {
  description = "Common tags to be applied to all resources"
  type        = map(string)
  default = {
    Project     = "ComplianceX"
    Environment = "development"
    Terraform   = "true"
  }
}