# GitHub Copilot Instructions - ComplianceX

This file provides context and guidelines for GitHub Copilot to assist with ComplianceX development. All contributors using Copilot will benefit from these shared instructions.

## Purpose & Scope

ComplianceX is an **Azure DevOps web extension** that evaluates and visualizes the **compliance status** of projects across an Azure DevOps organization. It uses a **plugin-based rules system** to enforce compliance standards (e.g., branch protection, pull request policies, build validation) and provides automated remediation capabilities.

**Architecture:**
- **Python (FastAPI) backend** - REST API for compliance evaluation and rule execution
- **React/TypeScript frontend** - Azure DevOps extension UI using Fluent UI components
- **Plugin system** - Extensible rule engine for custom compliance checks
- **No Azure Functions** - Backend runs as a standalone FastAPI service (not serverless)

**Key Concepts:**
- Rules are Python plugins that inherit from `ComplianceRulePlugin`
- Frontend integrates with Azure DevOps Extension SDK for authentication and context
- Backend uses Azure DevOps Python SDK for API access
- Feature flags control rule activation via `config/features.yaml`

## Tech Stack (what Copilot should use by default)

### Backend
- **Python 3.8+** with FastAPI for REST API
- **Pydantic** for data validation and models
- **Azure DevOps Python SDK** (`azure-devops>=7.1.0`) for API integration
- **pytest** for testing with asyncio support
- **SQLAlchemy + Alembic** for database (when implemented)
- **aiohttp** for async HTTP calls

### Frontend
- **TypeScript** with strict mode enabled (`tsconfig.json`)
- **React 18** with functional components and hooks
- **Azure DevOps Extension SDK** for host communication, context, theming, and access tokens
- **Azure DevOps Extension API** for REST clients across services
- **Fluent UI** (`@fluentui/react`) for Azure DevOps-styled components
- **Axios** for HTTP calls to backend API
- **Webpack** for bundling (produces `.vsix` extension package)
- **Jest + React Testing Library** for frontend tests

### Build & Package
- **npm scripts** for frontend build
- **webpack** to bundle TypeScript → JavaScript
- **tfx-cli** to package `.vsix` for Azure DevOps Marketplace
- **ESLint + Prettier** for code quality (`.eslintrc.json`, `.prettierrc.json` if added)

## Code Style & Conventions

### Python Backend
- Follow **PEP 8** style guide
- Use **type hints** for all function parameters and return values
- Use **snake_case** for files, functions, variables
- Use **PascalCase** for classes
- Add **docstrings** to all public classes and methods (Google style)
- Prefer **async/await** for I/O operations
- Use **Pydantic models** for API request/response validation

**Example:**
```python
async def check_compliance(self, context: Dict[str, Any]) -> ComplianceCheck:
    """Execute the compliance check.
    
    Args:
        context: Dictionary containing project and repository information
        
    Returns:
        ComplianceCheck result with status and details
    """
    pass
```

### TypeScript/React Frontend
- Use **TypeScript strict mode** (all new code must be typed)
- Use **PascalCase** for components and interfaces
- Use **camelCase** for functions and variables
- **Prefix interfaces with 'I'** (e.g., `IComplianceRule`)
- Use **functional components** with hooks (no class components)
- Add **JSDoc comments** for complex functions
- Follow **Fluent UI component patterns** for consistency with Azure DevOps

**Example:**
```typescript
interface IComplianceRule {
    id: string;
    name: string;
    enabled: boolean;
}

export const ComplianceDashboard: React.FC = () => {
    // Component implementation
};
```

### File Naming
- Python: `snake_case.py` (e.g., `compliance_service.py`)
- TypeScript Components: `PascalCase.tsx` (e.g., `ComplianceDashboard.tsx`)
- TypeScript Services: `camelCase.ts` (e.g., `apiClient.ts`)
- Test files: `test_*.py` for Python, `*.test.tsx` for TypeScript
- Configuration: `kebab-case.yaml` (e.g., `feature-flags.yaml`)

See `docs/development/naming_conventions.md` for complete details.

## Repository Structure & Conventions

Copilot should respect and extend the existing structure:

```
ComplianceX/
├── .github/                    # GitHub workflows, copilot instructions
├── config/                     # Configuration files
│   ├── features.yaml          # Feature flags
│   └── settings.example.yaml  # Settings template
├── docs/                       # Documentation
│   ├── api/                   # API documentation
│   ├── development/           # Development guides
│   ├── plugins/               # Plugin development
│   └── setup/                 # Setup instructions
├── src/
│   ├── backend/               # Python FastAPI backend
│   │   ├── api/              # API routes
│   │   ├── core/             # Core business logic
│   │   ├── models/           # Pydantic models
│   │   ├── plugins/          # Plugin system
│   │   └── services/         # Service layer
│   └── frontend/              # React/TypeScript frontend
│       ├── components/        # React components
│       └── hooks/            # Custom React hooks
├── tests/                     # Test files
│   ├── backend/              # Python tests
│   └── frontend/             # TypeScript tests
├── vss-extension.json         # Azure DevOps extension manifest
├── package.json               # Node.js dependencies
├── requirements.txt           # Python dependencies
└── tsconfig.json             # TypeScript configuration
```

**Key Files:**
- **`vss-extension.json`** - Extension manifest (IDs, scopes, contributions, targets)
- **`config/features.yaml`** - Feature flag configuration
- **`src/backend/api/main.py`** - FastAPI application entry point
- **`src/frontend/App.tsx`** - React application root

## Architecture Patterns

### Backend Plugin System
- All compliance rules inherit from `ComplianceRulePlugin` base class (in `src/backend/core/compliance/base_rules.py`)
- Rules **must implement**:
  - `check_compliance(context)` - Execute the compliance check
  - `get_rule_definition()` - Return rule metadata
- Use **mixins** for cross-cutting concerns:
  - `AutoFixMixin` - For rules that can auto-remediate issues
  - `NotificationMixin` - For rules that send notifications
- Plugins are **discovered automatically** from `src/backend/plugins/rules/`
- Each plugin returns a `ComplianceCheck` Pydantic model

**Example Plugin:**
```python
from src.backend.core.compliance.base_rules import AutoFixableRule
from src.backend.models.compliance import ComplianceRule, ComplianceCheck

class BranchProtectionRule(AutoFixableRule):
    def get_rule_definition(self) -> ComplianceRule:
        return ComplianceRule(
            id="branch-protection",
            name="Branch Protection Rule",
            description="Ensures main branch has required protection",
            level="error"
        )
    
    async def check_compliance(self, context: Dict[str, Any]) -> ComplianceCheck:
        # Implementation
        pass
```

### Backend Service Layer
- Business logic lives in `src/backend/services/`
- Services should use **dependency injection**
- Keep services **focused on single responsibility**
- Services coordinate between plugins and external APIs (Azure DevOps)
- Use `ComplianceService` to orchestrate compliance checks

### Backend API Design
- Use **FastAPI** with proper dependency injection
- Follow **REST conventions**: GET for reads, POST for creates, PUT/PATCH for updates
- Always include **proper error handling** and HTTP status codes
- **Version APIs**: `/api/v1/...`
- Return **Pydantic models** for validation
- Use **async/await** for all I/O operations

### Frontend Extension Model
- Follow **Azure DevOps contribution model**:
  - **Hubs** - Full page views in Azure DevOps
  - **Actions** - Context menu items
  - **Tabs** - Additional tabs on existing pages
  - **Widgets** - Dashboard widgets
- Each contribution includes:
  - Entry in `vss-extension.json` (contribution definition)
  - HTML file (iframe entry page)
  - TypeScript file (root script)
  - Optional SCSS for styles
- Initialize with **Azure DevOps Extension SDK** early
- Use **getAccessToken()** for authenticated API calls
- Use **azure-devops-extension-api** clients for Azure DevOps REST calls
- Use **axios** for calls to ComplianceX backend API

**Example Contribution Pattern:**
```typescript
import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IProjectPageService } from "azure-devops-extension-api";

async function initializeExtension() {
    await SDK.init();
    const projectService = await SDK.getService<IProjectPageService>(
        CommonServiceIds.ProjectPageService
    );
    const project = await projectService.getProject();
    // Use project context
}
```

## Git Workflow

### Branching Strategy
**We use a simplified feature-branch model with single branch type:**

- **All branches** use pattern: `feature/{issue-number}-{short-description}`
- Always branch from `main`
- Work type identified by GitHub labels, not branch names
- Examples:
  - `feature/001-azure-devops-client-auth` (new feature)
  - `feature/023-fix-dashboard-bug` (bugfix)
  - `feature/045-update-dependencies` (chore)

See `docs/development/branching-strategy.md` for complete workflow.

### Commit Messages
Follow Conventional Commits format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code formatting (no logic change)
- `refactor:` Code restructuring
- `test:` Adding/updating tests
- `chore:` Maintenance, dependencies, tooling

**Examples:**
```
feat(devops): add Azure DevOps authentication client
fix(api): resolve timeout on compliance check endpoint
docs(readme): update installation instructions
test(compliance): add unit tests for branch protection rule
```

## Testing Requirements

### Python Tests
- Use pytest for all backend tests
- Minimum 80% code coverage for new code
- Tests go in `tests/backend/` mirroring `src/backend/` structure
- Use `test_` prefix for test files and functions
- Mock external API calls (Azure DevOps, etc.)

**ExBackend Authentication (Python)
- Use **Azure DevOps Python SDK** (`azure-devops>=7.1.0b4`)
- Support **PAT (Personal Access Token)** authentication
- Store credentials **securely** - never in code
- Use **environment variables** or configuration files (excluded from git)
- Handle **token expiration** gracefully with proper error messages
- Use `Connection` class from `azure.devops.connection`

**Example:**
```python
from azure.devops.connection import Connection
from msrest.authentication import BasicAuthentication

credentials = BasicAuthentication('', personal_access_token)
connection = Connection(base_url=organization_url, creds=credentials)
```

### Frontend Authentication (TypeScript)
- Use **Azure DevOps Extension SDK** to obtain access tokens at runtime
- Call `SDK.getAccessToken()` for authenticated REST calls
- **Never embed secrets** in frontend code or extension bundle
- Tokens are obtained from the Azure DevOps host context

**Example:**
```typescript
import * as SDK from "azure-devops-extension-sdk";

const token = await SDK.getAccessToken();
const authHeader = `Bearer ${token}`;
```

### API Calls Best Practices
- Use official **`azure-devops` Python SDK** clients when available (preferred)
- Fall back to REST API only when SDK doesn't provide needed functionality
- **Cache API responses** appropriately (use feature flag settings)
- Implement **retry logic with exponential backoff** (use `tenacity` library)
- **Respect rate limits** - Azure DevOps has per-user and per-app limits
- Use **pagination** for large result sets
- Log API errors with context for debugging

### Azure DevOps SDK Clients (Python)
Common clients to use in backend services:
- `CoreClient` - Projects, teams, processes
- `GitClient` - Repositories, branches, pull requests, policies
- `BuildClient` - Pipelines, builds, definitions
- `WorkItemTrackingClient` - Work items
- `SecurityClient` - Permissions and security

### TypeScript Tests
- Use Jest and React Testing Library
- Tests go in `tests/frontend/` or colocated with components
- Use `.test.tsx` suffix
- Test user interactions, not implementation details

## Documentation Expectations

### Code Documentation
- Add docstrings/JSDoc for all public APIs
- Document complex algorithms inline
- Explain "why" not just "what" in comments
- Keep comments up-to-date with code changes

### Project Documentation
- Update `docs/development/feature-roadmap.md` when starting new features
- Add plugin examples to `docs/plugins/examples/` for new rule types
- Update API docs in `docs/api/` when changing endpoints
- Keep README.md current with setup instructions

## Common Patterns to Follow

### Error Handling
```python
# Python - Always provide meaningful error context
try:
    result = await api_call()
except Exception as e:
    return ComplianceCheck(
        rule_id=self.rule.id,
        status="error",
        details={"error": str(e), "context": "Additional context"},
        timestamp=datetime.utcnow().isoformat()
    )
```

```typescript
// TypeScript - Use proper error boundaries
try {
    const data = await fetchComplianceData();
    setData(data);
} catch (error) {
    console.error('Failed to fetch compliance data:', error);
    setError(error as Error);
}
```

### Async Operations
```python
# Python - Use async/await for I/O
async def fetch_repository_data(repo_id: str) -> Dict[str, Any]:
    async with aiohttp.ClientSession() as session:
        async with session.get(f"/api/repos/{repo_id}") as response:
            return await response.json()
```

```typescript
// TypeScript - Use hooks for async in React
const [data, setData] = useState<ComplianceData | null>(null);

useEffect(() => {
    const fetchData = async () => {
        const result = await apiClient.getCompliance(projectId);
        setData(result);
    };
    fetchData();
}, [projectId]);
```

## Dependenc& Compliance Requirements (strongly enforced)

### Secrets Management
- **Never embed secrets** in code, commits, configuration files, or test files
- **Backend**: Read tokens from environment variables or Azure Key Vault
- **Frontend**: Obtain tokens via **Azure DevOps Extension SDK** at runtime (getAccessToken)
- Use `.env` files for local development (ensure they're in `.gitignore`)
- Use `config/settings.example.yaml` as template; actual settings file excluded from git
- If credential scanning is configured, respect `credscan-exclusion.json` intentionally

### Input Validation & Sanitization
- **Backend**: Validate all external input using Pydantic models
- **Frontend**: Sanitize output to prevent XSS attacks
- Use parameterized queries when database is implemented (SQLAlchemy ORM)
- Never trust data from Azure DevOps API; validate before processing

### Azure DevOps Security Integration
- Follow **principle of least privilege** for extension scopes in `vss-extension.json`
- Request **minimum scopes required** (e.g., read-only unless write actions needed)
- Align with **GitHub Advanced Security for Azure DevOps** features:
  - Secret scanning
  - Dependency scanning
  - CodeQL analysis
  - **Do not implement redundant scanners** - surface upstream results instead
- Consider **Microsoft Security DevOps (MSDO)** integration for enhanced scanning
- Follow Microsoft guidance for **securing Azure DevOps** (Zero Trust, access control)
- Do not bypass Azure DevOps security features (permissions, policies, workspace trust)

### Dependency Management
- Keep dependencies **updated regularly** for security patches
- Run `npm audit` for frontend, `pip-audit` for backend
- Pin major versions in `requirements.txt`: `fastapi>=0.104.0`
- Use exact versions in `package.json` for production dependencies
- Review dependency licenses for compliance

### API Security
- Use **HTTPS only** for API endpoints
- Implement **rate limiting** on backend API
- Add **CORS configuration** appropriately for Azure DevOps extension
- Log security events (auth failures, suspicious activity)
- Handle errors without leaking sensitive information
### TypeScript
- Add to `package.json` with semantic versioning
- Separate `dependencies` from `devDependencies`
- Use exact versions for production: `"react": "18.2.0"`
- RAzure DevOps Extension Manifest Rules

The **`vss-extension.json`** file defines the extension and must remain valid.

### Required Properties
- `manifestVersion`: Always `1`
- `id`: Unique extension identifier
- `version`: Semantic versioning (e.g., `1.2.3`)
- `publisher`: Marketplace publisher ID
- `name`: Display name
- `description`: Brief description
- `targets`: Array of target platforms (typically `Microsoft.VisualStudio.Services`)
- `icons`: Extension icon files
- `scopes`: Minimum required scopes (principle of least privilege)
- `contributions`: Array of hubs, actions, tabs, widgets
- `files`: Files to include in `.vsix` package

### Scopes (Request Minimum Required)
ComBuild, Package, and Publish

### Frontend Build
```bash
# Install dependencies
npm install

# Build TypeScript → JavaScript bundles
npm run build

# Watch mode for development
npm run watch

# Run tests
npm test
```

### Backend Development
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run API server
uvicorn src.backend.api.main:app --reload

# Run tests
pytest tests/backend
```

### Package Extension
```bash
# Build frontend first
npm run build

# Package as .vsix
npm run package

# Output: compliancex-{version}.vsix
```

### Marketplace Publishing
Use **Azure DevOps Extension Tasks** or **tfx-cli** for CI/CD automation:
```Style & Quality

### Linting and Formatting
- **Backend**: Follow PEP 8, use `black` or `autopep8` for formatting
- **Frontend**: Use ESLint + Prettier (configure if not present)
- Generate **TypeScript with explicit types** and strict mode
- Prefer **functional React components**; avoid large monolithic files
- Split UI logic, services, and API calls into separate modules
- Follow existing patterns in the sample code

### Testing Requirements
- **Backend**: 80% code coverage minimum for new code
- **Frontend**: Test user interactions, not implementation details
- Mock external dependencies (Azure DevOps API)
- Use async test patterns (`@pytest.mark.asyncio`, async/await in Jest)

## Do Not

- ❌ **Do not** output credentials, PAT tokens, or certificate material in source/test files
- ❌ **Do not** bypass Azure DevOps security features (permissions, policies, workspace trust)
- ❌ **Do not** hardcode organization URLs, project names, or repository IDs
- ❌ **Do not** commit `.env` files with actual secrets (only `.env.example`)
- ❌ **Do not** use deprecated Azure DevOps APIs or SDK methods
- ❌ **Do not** implement custom security scanners (use Azure DevOps built-in features)
- ❌ **Do not** use class components in React (use functional components with hooks)

## Quick Reference Links

### Documentation
- Branching Strategy: `docs/development/branching-strategy.md`
- Feature Roadmap: `docs/development/feature-roadmap.md`
- Naming Conventions: `docs/development/naming_conventions.md`
- Plugin Development: `docs/plugins/development-guide.md`
- Setup Instructions: `docs/setup/README.md`

### External Resources
- [Azure DevOps Extension SDK](https://github.com/microsoft/azure-devops-extension-sdk)
- [Azure DevOps Extension API](https://github.com/microsoft/azure-devops-extension-api)
- [Azure DevOps Python SDK](https://github.com/microsoft/azure-devops-python-api)
- [Extension Manifest Reference](https://learn.microsoft.com/en-us/azure/devops/extend/develop/manifest)
- [Contribution Points](https://learn.microsoft.com/en-us/azure/devops/extend/develop/contributions-overview)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Fluent UI React](https://developer.microsoft.com/en-us/fluentui)

## When in Doubt

1. **Look at existing code** for patterns (especially in `src/backend/plugins/rules/branch_protection.py`)
2. **Check the documentation** in `docs/` directory
3. **Follow the principle of least surprise** - use common patterns
4. **Write code you'd want to review** - clear, maintainable, well-tested
5. **Consult official SDK documentation** for Azure DevOps integration
6. **Ask questions** in issues or discussions (open source project)

---

**Remember**: These guidelines help maintain consistency and quality across the project. When GitHub Copilot suggests code, verify it follows these patterns and aligns with the actual technology stack (Python/FastAPI backend, not Azure Functions). Keep security best practices in mind, especially around credential management
```python
# src/backend/plugins/rules/pr_policy.py
from src.backend.core.compliance.base_rules import ComplianceRuleBase
from src.backend.models.compliance import ComplianceRule, ComplianceCheck

class PullRequestPolicyRule(ComplianceRuleBase):
    def get_rule_definition(self) -> ComplianceRule:
        return ComplianceRule(
            id="pr-policy",
            name="Pull Request Policy",
            description="Ensures required reviewers are configured",
            level="error"
        )
    
    async def check_compliance(self, context: Dict[str, Any]) -> ComplianceCheck:
        # Fetch policy from Azure DevOps via GitClient
        # Validate settings
        # Return ComplianceCheck result
        pass
```

### Reading Policy State
- Use **Azure DevOps Python SDK clients** (GitClient, BuildClient) to fetch policy state
- Check pull request policies, branch policies, build definitions
- Compare against rule requirements
- Render status per project in frontend

### Auto-Fix Actions
- For rules with `AutoFixMixin`, implement `can_auto_fix()` and `apply_fix()`
- Call backend API from frontend with appropriate permissions
- Authenticate using token from SDK (frontend) or PAT (backend)
- Always verify permissions before applying fixes

## Prompts Copilot Should Understand

### Backend Prompts
1. **Create a new compliance rule** for checking minimum reviewers on pull requests, using Azure DevOps GitClient
2. **Implement a service** to fetch all repositories for a project using azure-devops Python SDK
3. **Add an API endpoint** in FastAPI to trigger compliance check for a project
4. **Write tests** for the branch protection rule using pytest and mocks

### Frontend Prompts
1. **Create a hub** named "Compliance Dashboard" showing a table of projects with rule status (React + Fluent UI)
2. **Implement a component** to display compliance report with pass/fail indicators
3. **Add a settings view** to configure enabled rules using React hooks
4. **Create an action button** that triggers backend API call to run compliance check

### Integration Prompts
1. **Wire up the compliance router** to main FastAPI app with proper error handling
2. **Initialize Azure DevOps Extension SDK** in the React app and fetch project context
3. **Implement authentication** flow using PAT tokens in backend DevOps client

## Feature Development Workflow

1. **Check the roadmap**: Review `docs/development/feature-roadmap.md`
2. **Create GitHub issue**: Use issue templates, apply labels (type, priority, area)
3. **Create feature branch**: `feature/{issue#}-{description}`
4. **Implement with tests**: Write tests first (TDD) or alongside code
5. **Update documentation**: Keep docs in sync with code changes
6. **Create PR**: Use PR template in `.github/`, reference issue
7. **CI/CD checks**: Ensure all tests pass (pytest, jest, linting)
8. **Review process**: Address feedback, iterate
9. **Merge to main**: Squash or merge commit based on history
10. **Tag if release**: Use `git tag -a v1.x.x` for version releases
11  "id": "compliancex",
    "publisher": "wwarobert",
    "version": "1.0.0",
    "scopes": [
        "vso.work",
        "vso.code",
        "vso.build",
        "vso.project"
    ],
    "contributions": [
        {
            "id": "compliance-hub",
            "type": "ms.vss-web.hub",
            "targets": ["ms.vss-web.project-admin-hub-group"],
            "properties": {
                "name": "Compliance",
                "uri": "dist/compliance-hub.html"
            }
        }
    ]
}
```

### Contribution Types
Use Microsoft's contribution model:
- **Hub** (`ms.vss-web.hub`) - Full page view
- **Action** (`ms.vss-web.action`) - Context menu item
- **Tab** (`ms.vss-web.tab`) - Tab on existing page
- **Widget** (`ms.vss-dashboards-web.widget`) - Dashboard widget

See [Azure DevOps Extension Contributions](https://learn.microsoft.com/en-us/azure/devops/extend/develop/contributions-overview) for details.

## UI/UX Guidelines

### Use Fluent UI Components
- Use **Fluent UI** (`@fluentui/react`) for Azure DevOps-styled components
- Ensure **theming matches** the Azure DevOps host (light/dark)
- Use SDK methods to detect and respond to theme changes
- Avoid custom CSS that breaks Azure DevOps layout

### Compliance Views
- Keep rule views **simple**: tables/lists of projects with rule statuses
- Provide **actionable fixes**: links to policies, repos, or auto-fix buttons
- Source data via **Azure DevOps Extension API** clients (GitClient, BuildClient)
- Show **loading states** and **error boundaries** appropriately
- Use **Fluent UI spacing and layout** components

### Accessibility
- Follow WCAG 2.1 AA standards
- Ensure keyboard navigation works
- Add proper ARIA labels
- Test with screen readers

## Performance Considerations

### Backend Performance
- **Cache Azure DevOps API responses** appropriately (consider Redis when scaling)
- Use **pagination** for large result sets
- Implement **background jobs** for long-running compliance checks (use Celery when needed)
- Optimize **database queries** when implemented (use SQLAlchemy query optimization)
- Use **async/await** consistently for I/O operations

### Frontend Performance
- **Lazy load** frontend components (React.lazy)
- Use **React.memo** for expensive component renders
- **Debounce** user input for search/filter
- Avoid unnecessary re-renders
- Use **virtual scrolling** for large lists (e.g., react-window)
- Handle token expiration gracefully

### API Calls
- Use official `azure-devops` Python SDK when possible
- Cache API responses appropriately
- Implement retry logic with exponential backoff
- Respect rate limits

## Feature Flags

Features are controlled via `config/features.yaml`. When implementing new features:
- Check feature flags before execution
- Make features toggleable without code changes
- Document feature parameters
- Default to disabled for new experimental features

## Security Best Practices

- Never commit secrets, tokens, or credentials
- Validate all external input
- Use parameterized queries (when adding database)
- Keep dependencies updated
- Follow principle of least privilege for API access
- Sanitize output in frontend to prevent XSS

## Performance Considerations

- Cache Azure DevOps API responses appropriately
- Use pagination for large result sets
- Implement background jobs for long-running compliance checks
- Optimize database queries (when adding database)
- Lazy load frontend components
- Use React.memo for expensive component renders

## Open Source Project Guidelines

This is an open source project:
- Write code that's easy for new contributors to understand
- Be welcoming and helpful in PR reviews
- Document decisions in issues and PRs
- Keep the barrier to contribution low
- Follow the Code of Conduct (when added)

## Feature Development Workflow

1. **Check the roadmap**: Review `docs/development/feature-roadmap.md`
2. **Create GitHub issue**: Use issue templates, apply labels
3. **Create feature branch**: `feature/{issue#}-{description}`
4. **Implement with tests**: Write tests first (TDD) or alongside code
5. **Update documentation**: Keep docs in sync with code changes
6. **Create PR**: Use PR template, reference issue
7. **CI/CD checks**: Ensure all tests pass
8. **Review process**: Address feedback, iterate
9. **Merge to main**: Squash or merge commit based on history
10. **Delete branch**: Clean up after merge

## Quick Reference Links

- Branching Strategy: `docs/development/branching-strategy.md`
- Feature Roadmap: `docs/development/feature-roadmap.md`
- Naming Conventions: `docs/development/naming_conventions.md`
- Plugin Development: `docs/plugins/development-guide.md`
- Setup Instructions: `docs/setup/README.md`

## When in Doubt

1. Look at existing code for patterns
2. Check the documentation in `docs/`
3. Follow the principle of least surprise
4. Write code you'd want to review
5. Ask questions in issues or discussions

---

**Remember**: These guidelines help maintain consistency and quality. When GitHub Copilot suggests code, verify it follows these patterns. Happy coding!
