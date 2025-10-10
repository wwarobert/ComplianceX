# Infrastructure Setup and Development Guide

This document describes the Azure infrastructure setup for ComplianceX and provides guidance for developers working with the infrastructure.

## Infrastructure Components

The ComplianceX application uses the following Azure resources:

1. **Cosmos DB**
   - Stores scan results and compliance data
   - Uses SQL API
   - Configured with Session consistency level

2. **Azure Functions**
   - Handles scheduled compliance scans
   - Python runtime
   - Consumption plan for cost optimization

3. **Application Insights**
   - Monitors application performance
   - Collects telemetry data

4. **Key Vault**
   - Stores sensitive configuration
   - Manages secrets and access keys

## Prerequisites

1. Install the following tools:
   ```powershell
   # Install Terraform
   winget install Hashicorp.Terraform

   # Install Azure CLI
   winget install Microsoft.AzureCLI
   ```

2. Configure Azure authentication:
   ```powershell
   # Login to Azure
   az login

   # Set subscription
   az account set --subscription "<subscription_id>"
   ```

## Local Development

### Setting Up Local Environment

1. Clone the repository:
   ```powershell
   git clone https://github.com/wwarobert/ComplianceX.git
   cd ComplianceX
   ```

2. Initialize Terraform:
   ```powershell
   cd infrastructure
   terraform init
   ```

3. Create a `terraform.tfvars` file:
   ```hcl
   environment = "dev"
   location    = "westeurope"
   common_tags = {
     Project     = "ComplianceX"
     Environment = "development"
     Owner       = "<your-name>"
   }
   ```

### Testing Infrastructure Changes

1. Format and validate Terraform code:
   ```powershell
   terraform fmt
   terraform validate
   ```

2. Preview changes:
   ```powershell
   terraform plan
   ```

3. Apply changes locally:
   ```powershell
   terraform apply
   ```

4. Clean up resources:
   ```powershell
   terraform destroy
   ```

## Deployment Pipeline

The infrastructure is deployed using GitHub Actions. The pipeline is configured in `.github/workflows/terraform.yml`.

### Pipeline Workflow

1. **On Pull Request:**
   - Formats Terraform code
   - Validates configuration
   - Generates plan
   - Posts plan as PR comment

2. **On Merge to Main:**
   - Formats Terraform code
   - Validates configuration
   - Applies changes automatically

### Required Secrets

Set up the following secrets in GitHub repository settings:

- `AZURE_CLIENT_ID`: Service Principal ID
- `AZURE_CLIENT_SECRET`: Service Principal Secret
- `AZURE_SUBSCRIPTION_ID`: Azure Subscription ID
- `AZURE_TENANT_ID`: Azure Tenant ID

## Best Practices

1. **State Management**
   - Use remote state storage in Azure Storage
   - Enable state locking
   - Never commit `.tfstate` files

2. **Security**
   - Use Key Vault for sensitive data
   - Follow least privilege principle
   - Enable diagnostic logging

3. **Cost Management**
   - Use consumption-based pricing where possible
   - Monitor resource usage
   - Clean up development resources

4. **Development Workflow**
   - Create feature branch
   - Make infrastructure changes
   - Test locally
   - Create pull request
   - Review and merge

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   ```
   Solution: Verify Azure CLI login and subscription
   ```

2. **State Lock Issues**
   ```
   Solution: Check for stuck locks in Azure Storage
   ```

3. **Resource Creation Failures**
   ```
   Solution: Check resource quotas and name availability
   ```

## Monitoring and Maintenance

1. **Application Insights**
   - Monitor application performance
   - Track custom metrics
   - Set up alerts

2. **Cost Management**
   - Review resource usage
   - Optimize as needed
   - Set up budgets

3. **Updates**
   - Regular provider updates
   - Security patches
   - Feature enhancements

## Backup and Recovery

1. **State Backup**
   - Regular state backups
   - Version control
   - Recovery procedures

2. **Data Backup**
   - Cosmos DB backup policy
   - Point-in-time restoration
   - Geo-replication