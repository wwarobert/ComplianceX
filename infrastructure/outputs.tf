# Output values for ComplianceX infrastructure

output "resource_group_name" {
  value = azurerm_resource_group.main.name
}

output "cosmos_db_endpoint" {
  value = azurerm_cosmosdb_account.main.endpoint
}

output "function_app_name" {
  value = azurerm_windows_function_app.scanner.name
}

output "application_insights_key" {
  value     = azurerm_application_insights.main.instrumentation_key
  sensitive = true
}

output "key_vault_uri" {
  value = azurerm_key_vault.main.vault_uri
}