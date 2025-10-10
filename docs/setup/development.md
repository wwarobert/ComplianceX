# Development Environment Setup Guide

## Prerequisites Installation

### 1. Python Setup
1. Download and install Python 3.8 or higher from [python.org](https://python.org)
2. Verify installation:
   ```bash
   python --version
   pip --version
   ```

### 2. Node.js Setup
1. Download and install Node.js 20 or higher from [nodejs.org](https://nodejs.org)
2. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### 3. Azure DevOps CLI
1. Install Azure DevOps Extension for CLI:
   ```bash
   npm install -g tfx-cli
   ```
2. Verify installation:
   ```bash
   tfx version
   ```

### 4. Visual Studio Code
1. Download and install VS Code from [code.visualstudio.com](https://code.visualstudio.com)
2. Install recommended extensions:
   - Python
   - Python Test Explorer
   - TypeScript and JavaScript Language Features
   - ESLint
   - Azure DevOps Extension Development

## Project Setup

### 1. Clone and Initialize
```bash
# Clone the repository
git clone https://github.com/wwarobert/ComplianceX.git
cd ComplianceX

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Unix/macOS:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies
npm install
```

### 2. Configure Development Settings
1. Create local configuration:
   ```bash
   copy config\settings.example.yaml config\settings.yaml
   copy config\features.yaml config\features.local.yaml
   ```

2. Create Azure DevOps PAT (Personal Access Token):
   - Go to Azure DevOps → User Settings → Personal Access Tokens
   - Create new token with scopes:
     - Code (Read & Write)
     - Extension Management (Read & Write)
     - Marketplace (Publish)
   - Save the token securely

3. Update configuration files with your settings:
   - Edit `config/settings.yaml` with your Azure DevOps organization details
   - Edit `config/features.local.yaml` for local feature flags

## Running the Development Environment

### 1. Start Backend Server
```bash
# Make sure virtual environment is activated
venv\Scripts\activate

# Start FastAPI server with hot reload
uvicorn src.backend.api.main:app --reload --port 8000
```

### 2. Start Frontend Development Server
```bash
# In a new terminal
npm run dev
```

### 3. Build Extension
```bash
# Create extension package
npm run build
npm run package
```

## Testing

### 1. Run Backend Tests
```bash
# Run all tests
pytest tests/backend

# Run with coverage
pytest tests/backend --cov=src/backend

# Run specific test file
pytest tests/backend/test_compliance_engine.py
```

### 2. Run Frontend Tests
```bash
# Run all tests
npm test

# Run with watch mode
npm test -- --watch
```

### 3. Manual Testing
1. Install the extension locally:
   ```bash
   tfx extension install --publisher wwarobert --vsix ComplianceX-1.0.0.vsix
   ```

2. Access the extension in Azure DevOps:
   - Go to your Azure DevOps organization
   - Project Settings → Extensions → ComplianceX

## Debugging

### Backend Debugging
1. In VS Code:
   - Set breakpoints in Python code
   - Use the "Python: FastAPI" launch configuration
   - Start debugging (F5)

### Frontend Debugging
1. In VS Code:
   - Set breakpoints in TypeScript code
   - Use the "Chrome" launch configuration
   - Start debugging (F5)

### Extension Debugging
1. In VS Code:
   - Use the "Attach to Extension Host" launch configuration
   - Start debugging when testing in Azure DevOps

## Common Issues and Solutions

### Backend Issues
1. **Import errors after adding new packages**
   - Solution: Reactivate virtual environment and reinstall requirements
   ```bash
   deactivate
   venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Database migration errors**
   - Solution: Reset migrations
   ```bash
   alembic revision --autogenerate
   alembic upgrade head
   ```

### Frontend Issues
1. **Node modules conflicts**
   - Solution: Clean npm cache and reinstall
   ```bash
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

2. **Build errors**
   - Solution: Check TypeScript version compatibility
   ```bash
   npm run clean
   npm run build
   ```

## Next Steps
- Review the [API Documentation](../api/README.md)
- Check the [Contribution Guide](../../CONTRIBUTING.md)
- Explore [Example Plugins](../examples/README.md)