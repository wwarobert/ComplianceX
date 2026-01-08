# Getting Started with ComplianceX

Welcome to ComplianceX! This guide will help you understand what ComplianceX is and how to get started.

## What is ComplianceX?

ComplianceX is an Azure DevOps extension that helps organizations maintain and enforce compliance standards across their projects. It automatically checks repositories, pipelines, and project settings against configurable compliance rules.

### Key Features

- **🔍 Automated Compliance Checks** - Continuously monitor projects for compliance violations
- **🔧 Auto-Fix Capabilities** - Automatically remediate common compliance issues
- **📊 Compliance Dashboard** - Visual overview of compliance status across organization
- **🔌 Extensible Plugin System** - Create custom compliance rules for your needs
- **⚙️ Feature Flags** - Enable/disable rules without code changes
- **📈 Historical Reporting** - Track compliance trends over time

## How It Works

```
┌─────────────────┐
│  Azure DevOps   │
│  Organization   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ComplianceX    │
│   Extension     │
└────────┬────────┘
         │
         ├─► Fetch Projects & Repos
         ├─► Run Compliance Rules
         ├─► Generate Reports
         └─► Auto-Fix Issues (optional)
```

### Architecture

- **Frontend**: React/TypeScript UI integrated into Azure DevOps
- **Backend**: Python FastAPI REST API for rule execution
- **Plugin System**: Extensible Python plugins for custom rules
- **Storage**: SQLAlchemy for historical data (when configured)

## Core Concepts

### Compliance Rules

Rules are the heart of ComplianceX. Each rule checks a specific compliance requirement:

- **Branch Protection** - Ensures main branches have required policies
- **Pull Request Policies** - Validates PR requirements (reviewers, work items)
- **Build Validation** - Checks for required build policies
- **Security Scanning** - Verifies security scan configurations

### Rule Status

Each rule can have one of four statuses:

- ✅ **Passed** - Compliant with the rule
- ❌ **Failed** - Non-compliant, requires attention
- ⚠️ **Warning** - Partially compliant
- ⚡ **Error** - Rule execution failed

### Feature Flags

Control which rules are active using `config/features.yaml`:

```yaml
features:
  branch-protection:
    enabled: true
    parameters:
      required_reviewers: 1
```

## Quick Start Paths

Choose your path based on your role:

### 👤 I want to use ComplianceX
→ Start with **[Installation Guide](setup/Installation.md)**

### 💻 I want to contribute code
→ Start with **[Development Setup](development/Development-Setup.md)**

### 🔌 I want to create custom rules
→ Start with **[Your First Rule](plugins/Your-First-Rule.md)**

### 🚀 I want to deploy to my organization
→ Start with **[Deployment Guide](setup/Deployment.md)**

## Technology Stack

### Backend
- Python 3.8+ with FastAPI
- Azure DevOps Python SDK
- Pydantic for data validation
- pytest for testing

### Frontend
- TypeScript with React 18
- Azure DevOps Extension SDK
- Fluent UI components
- Webpack bundling

## System Requirements

- Python 3.8 or higher
- Node.js 20 or higher
- Azure DevOps organization access
- Visual Studio Code (recommended)

## Next Steps

1. **[Install ComplianceX](setup/Installation.md)** - Set up locally or in your organization
2. **[Configure Rules](setup/Configuration.md)** - Customize compliance requirements
3. **[View Dashboard](User-Guide.md)** - Monitor compliance status
4. **[Create Custom Rules](plugins/Plugin-Development.md)** - Extend functionality

## Need Help?

- 📖 Browse the [full documentation](README.md)
- 🐛 [Report issues](https://github.com/wwarobert/ComplianceX/issues)
- 💬 [Ask questions](https://github.com/wwarobert/ComplianceX/discussions)

---

**Next**: [Installation Guide](setup/Installation.md) →
