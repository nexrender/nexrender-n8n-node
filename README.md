![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-nexrender

This is an n8n community node. It lets you use the Nexrender Cloud API in your n8n workflows to manage templates, render jobs, batches, fonts, secrets, and to read your team.

Nexrender is a cloud rendering platform for Adobe After Effects projects, providing API-based control for template upload, job creation, asset injection, and more.

Note that this node requires an active subscription with [Nexrender Cloud](https://nexrender.com/). Get your trial [today](https://www.nexrender.com/contact)!

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

Package name: `@nexrender/n8n-nodes-nexrender`

## Operations

The node exposes the following resources and operations:

- Template
  - Create: POST /templates — register a template and get upload info
  - List (Deprecated): GET /templates — list templates with embedded project data
  - Get: GET /templates/{id} — get template details
  - Update: PATCH /templates/{id} — update display name
  - Delete: DELETE /templates/{id} — delete a template
  - Get Download URL: GET /templates/{id}/download — presigned URL to download the raw file
  - Get Upload URL: PUT /templates/{id}/upload — fresh presigned upload URL, returned as `uploadInfo`. Replacing a processed file keeps the old one in use until the new one is processed
  - List Metadata: GET /v3/templates — list lightweight template metadata
  - Get Metadata: GET /v3/templates/{id} — get lightweight template metadata
  - List Compositions: GET /v3/templates/{id}/compositions — list discovered compositions with limit/offset
  - List Layers: GET /v3/templates/{id}/layers — list discovered layers with limit/offset

- Job
  - Create: POST /jobs — create a render job with template, assets, settings, upload + webhook. `settings.type` can be `video`, `image`, `aep` or `lottie`
  - List: GET /jobs — supports filters: minimal, from, limit, from_date, to_date, states, exclude_states, sort, tags
  - Get: GET /jobs/{id} — job details, progress, stats, output URL. Turn on "Wait Until Finished/Error" to poll until the job is finished, failed, or manually cancelled
  - Get Logs: GET /jobs/{id}/logs — retrieve the stored plain-text render log
  - Cancel: PATCH /jobs/{id}/cancel — cancel a queued or pending job
  - Cancel Many: POST /jobs/cancel — cancel multiple queued or pending jobs
  - Create Join Job: POST /jobs/join — stitch two or more video assets and nested job outputs

- Batch
  - Create: POST /batches — create up to 1000 render jobs in one request. Set a Batch ID to make retries safe; temporary failures (503 `BATCH_RETRYABLE`) are retried with the same batch ID
  - Get: GET /batches/{id} — get batch status, stats, and jobs
  - Cancel: POST /batches/{id}/cancel — cancel cancellable jobs in a batch

- Font
  - Upload: POST /fonts — upload a TTF font (multipart/form-data)
  - List: GET /fonts — list fonts
  - Get: GET /fonts/{id} — get font metadata
  - Delete: DELETE /fonts/{id} — delete a font

- Team
  - Get: GET /team — the team that owns the API token: ID, name, and trial jobs left and end date when on a trial

- Secret
  - List: GET /secrets — list secrets (values not returned)
  - Create: PUT /secrets — create/update secret (name + value)
  - Delete: DELETE /secrets/{id} — delete a secret

## Credentials

Credential: “Nexrender API”

- API Token (required): Bearer token used to authenticate. You can generate a token in the Nexrender app: https://app.nexrender.com/team/settings
- Base URL (optional): Defaults to `https://api.nexrender.com/api/v2`. Override for on-prem environments.

The credential test calls GET /team.

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
  - Provide the Job body including the template (`template.id`, or `template.src` + `template.name` for a template URL), `assets`, optional `settings`, `webhook` and `upload` configuration
  - Optionally add a Job → Get node with “Wait Until Finished/Error” after Create to block until completion

- Render many jobs at once
  - Operation: Batch → Create with a `jobs` array, and optionally a `batchItemId` on each job
  - Set Options → Batch ID to a ULID you generate if the workflow may send the same batch again (for example with Retry On Fail). A repeated request creates only the missing jobs and returns status `replayed` or `partial`

- Check your trial
  - Operation: Team → Get returns `trial.jobsLeft` and `trial.expiresAt`, or `trial: null` when the team is not on a trial

- Monitor a job
  - Operation: Job → Get with `jobId`, or use Job → List with filters

- Inspect render logs
  - Operation: Job → Get Logs with `jobId`
  - The node returns `{ "jobId": "...", "logs": "..." }` for use by downstream nodes

- Manage fonts
  - Operation: Font → Upload (multipart/form-data with TTF)
  - Then reference fonts by file name in your job payload if needed

## Resources

- n8n community nodes docs: https://docs.n8n.io/integrations/#community-nodes
- Nexrender Cloud product site: https://nexrender.com/
- Generate an API token: https://app.nexrender.com/team/settings

## Version history

- 0.3.0 — Added Team → Get, safe batch retries with Batch ID, and stopping the job wait on manual cancellation
- 0.2.0 — Added batch, job cancellation, join job, and template metadata/composition/layer operations; fixed template download URL
- 0.1.0 — Initial release: Templates, Jobs, Fonts, Secrets operations
