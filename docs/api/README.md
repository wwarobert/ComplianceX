# API Documentation

## Endpoints

### Compliance Checking

#### GET /api/v1/compliance/check/{project_id}
Check compliance for a specific project.

**Parameters:**
- `project_id`: string (required) - Azure DevOps project ID

**Response:**
```json
{
    "project_id": "string",
    "project_name": "string",
    "checks": [
        {
            "rule_id": "string",
            "status": "string",
            "details": {},
            "timestamp": "string"
        }
    ],
    "overall_status": "string",
    "generated_at": "string"
}
```

### Rules Management

#### GET /api/v1/rules
Get all compliance rules.

**Response:**
```json
[
    {
        "id": "string",
        "name": "string",
        "description": "string",
        "level": "string",
        "enabled": true
    }
]
```

#### POST /api/v1/rules
Create a new compliance rule.

**Request Body:**
```json
{
    "name": "string",
    "description": "string",
    "level": "string",
    "enabled": true
}
```

### Reports

#### GET /api/v1/reports
Get compliance reports.

**Parameters:**
- `from_date`: string (optional) - Start date for report filtering
- `to_date`: string (optional) - End date for report filtering
- `project_id`: string (optional) - Filter by project

**Response:**
```json
{
    "reports": [
        {
            "id": "string",
            "project_id": "string",
            "generated_at": "string",
            "status": "string",
            "download_url": "string"
        }
    ]
}
```