# ComplianceX

A comprehensive compliance extension for Azure DevOps that helps organizations maintain and enforce compliance standards across their projects.

## 📖 Documentation

Comprehensive documentation is available in multiple locations:

- **[Documentation Hub](docs/README.md)** - Complete documentation index
- **[GitHub Wiki](../../wiki)** - Automatically synced wiki pages
- **[Setup Guide](docs/setup/README.md)** - Get started with ComplianceX
- **[Development Guidelines](docs/development/branching-strategy.md)** - Contribution workflow
- **[Plugin Development](docs/plugins/development-guide.md)** - Create custom rules
- **[GitHub Copilot Instructions](.github/copilot-instructions.md)** - AI-assisted development

## Project Structure

```
ComplianceX/
├── src/
│   ├── backend/                 # Python backend code
│   │   ├── api/                 # FastAPI routes and endpoints
│   │   │   └── v1/             # API version 1
│   │   ├── core/               # Core business logic
│   │   │   ├── compliance/     # Compliance checking logic
│   │   │   └── rules/         # Compliance rules definitions
│   │   ├── models/            # Data models and schemas
│   │   ├── services/          # External service integrations
│   │   │   ├── azure/        # Azure service integrations
│   │   │   └── devops/       # Azure DevOps API integration
│   │   └── utils/            # Utility functions and helpers
│   │
│   └── frontend/              # Azure DevOps Extension frontend
│       ├── components/        # UI components
│       │   ├── dashboard/     # Dashboard components
│       │   ├── reports/      # Report components
│       │   └── settings/     # Settings components
│       └── services/         # Frontend services
│
├── tests/                    # Test files
├── config/                  # Configuration files
├── docs/                   # Documentation
└── .vscode/              # VS Code settings
```

## Technology Stack

### Backend (Python)
- FastAPI - Web framework
- Azure SDK for Python - Azure services integration
- Azure DevOps Python SDK - DevOps integration
- PyYAML - Configuration management
- Pandas - Data processing
- Pytest - Testing

### Frontend (TypeScript)
- Azure DevOps Extension SDK
- React - UI components
- TypeScript - Type-safe development
- Jest - Testing

## Setup Instructions

### Prerequisites
1. Python 3.8 or higher
2. Node.js 20 or higher
3. Azure DevOps organization access
4. Visual Studio Code

### Backend Setup
1. Create a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Frontend Setup
1. Install Node.js dependencies:
   ```bash
   npm install
   ```

2. Build the extension:
   ```bash
   npm run build
   ```

### Configuration
1. Copy `config/settings.example.yaml` to `config/settings.yaml`
2. Update the configuration with your Azure DevOps organization details
3. Configure compliance rules in `config/compliance/rules.yaml`

## Development

### Running Tests
```bash
# Backend tests
pytest tests/backend

# Frontend tests
npm test
```

### Local Development
1. Start the backend server:
   ```bash
   python src/backend/api/main.py
   ```

2. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Features
- Automated compliance checking
- Customizable compliance rules
- Real-time monitoring
- Detailed reporting
- Automated fixes for non-compliant resources
- Integration with Azure DevOps pipelines

## Documentation
Detailed documentation can be found in the `docs` directory:
- [Setup Guide](docs/setup/README.md)
- [API Documentation](docs/api/README.md)
- [User Guide](docs/user-guide/README.md)

## Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.