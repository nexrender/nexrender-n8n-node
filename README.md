![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-nexrender

This is an n8n community node. It lets you use the Nexrender Cloud API in your n8n workflows to manage templates, render jobs, fonts, and secrets.

Nexrender is a cloud rendering platform for Adobe After Effects projects, providing API-based control for template upload, job creation, asset injection, and more.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)

## Installation

Follow the official guide to install community nodes in n8n:

https://docs.n8n.io/integrations/community-nodes/installation/

Package name: `n8n-nodes-nexrender-cloud`

## Operations

The node exposes the following resources and operations:

- Template
  - Create: POST /templates — register a template and get upload info
  - List: GET /templates — list templates for your team
  - Get: GET /templates/{id} — get template details
  - Update: PATCH /templates/{id} — update display name
  - Delete: DELETE /templates/{id} — delete a template
  - Get Download URL: GET /templates/{id}/upload — presigned URL to download the raw file
  - Get Upload URL: PUT /templates/{id}/upload — fresh presigned upload URL

- Job
  - Create: POST /jobs — create a render job with template, assets, settings, upload + webhook
  - List: GET /jobs — supports filters: minimal, from, limit, from_date, to_date, states, exclude_states, sort, tags
  - Get: GET /jobs/{id} — job details, progress, stats, output URL

- Font
  - Upload: POST /fonts — upload a TTF font (multipart/form-data)
  - List: GET /fonts — list fonts
  - Get: GET /fonts/{id} — get font metadata
  - Delete: DELETE /fonts/{id} — delete a font

- Secret
  - List: GET /secrets — list secrets (values not returned)
  - Create: PUT /secrets — create/update secret (name + value)
  - Delete: DELETE /secrets/{id} — delete a secret

## Credentials

Credential: “Nexrender API”

- API Token (required): Bearer token used to authenticate. You can generate a token in the Nexrender app: https://app.nexrender.com/team/settings
- Base URL (optional): Defaults to `https://api.nexrender.com/api/v2`. Override for on-prem environments.

## Compatibility

- Node.js: >= 20 (per package engines)
- n8n: built with Nodes API v1

## Usage

1) Add the Nexrender node to your workflow and select a Resource and Operation.

2) Set up “Nexrender API” credentials with your team API token.

3) Typical flows:

- Upload a new template
  - Operation: Template → Create (returns upload info)
  - Use the returned upload info to upload your file (via HTTP Request or custom logic)

- Render a job
  - Operation: Job → Create
  - Provide the Job body including `template.id`, `assets`, optional `settings`, `webhook` and `upload` configuration

- Monitor a job
  - Operation: Job → Get with `jobId`, or use Job → List with filters

- Manage fonts
  - Operation: Font → Upload (multipart/form-data with TTF)
  - Then reference fonts by file name in your job payload if needed

Notes:
- The Font upload endpoint expects multipart/form-data. If you need binary support sourced from a previous node, consider using an HTTP Request node for the upload step.

## Resources

- n8n community nodes docs: https://docs.n8n.io/integrations/#community-nodes
- Nexrender Cloud product site: https://nexrender.com/
- Generate an API token: https://app.nexrender.com/team/settings

## Version history

- 0.1.0 — Initial release: Templates, Jobs, Fonts, Secrets operations
