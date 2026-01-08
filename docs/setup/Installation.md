# Setup Guide

## Prerequisites

1. Python 3.8 or higher
2. Node.js 20 or higher
3. Azure DevOps organization access
4. Visual Studio Code

## Installation

### Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure the application:
- Copy `config/settings.example.yaml` to `config/settings.yaml`
- Update the configuration with your Azure DevOps organization details

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Build the extension:
```bash
npm run build
```

## Development

### Running the Backend

1. Start the FastAPI server:
```bash
uvicorn src.backend.api.main:app --reload
```

### Running the Frontend

1. Start the development server:
```bash
npm run dev
```

## Deployment

### Backend Deployment

1. Build the Docker image:
```bash
docker build -t compliancex-backend .
```

2. Deploy to Azure App Service:
```bash
az webapp up --name your-app-name --resource-group your-rg --sku B1 --docker-image compliancex-backend
```

### Extension Deployment

1. Package the extension:
```bash
npm run package
```

2. Publish to the Visual Studio Marketplace:
```bash
npm run publish
```

## Configuration

### Azure DevOps Configuration

1. Create a Personal Access Token (PAT) with the following scopes:
   - Code (Read)
   - Project and Team (Read)
   - Build (Read)
   - Release (Read)

2. Update the `settings.yaml` with your PAT

### Compliance Rules

1. Configure compliance rules in `config/compliance/rules.yaml`
2. Add custom rules in the `src/backend/core/rules` directory

## Troubleshooting

Common issues and their solutions:

1. Connection Issues
   - Verify PAT token permissions
   - Check network connectivity
   - Validate Azure DevOps organization URL

2. Build Failures
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall
   - Check TypeScript version compatibility