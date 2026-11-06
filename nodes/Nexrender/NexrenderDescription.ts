import { INodeProperties } from 'n8n-workflow';

export const nexrenderOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['template'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new template',
                action: 'Create template',

            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a template',
                action: 'Delete template',

            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a template by ID',
                action: 'Get template',

            },
            {
                name: 'Get Download URL',
                value: 'getDownloadUrl',
                description: 'Get a presigned download URL for the template file',
                action: 'Get template download URL',

            },
            {
                name: 'Get Metadata',
                value: 'getMetadata',
                description: 'Get lightweight template metadata by ID',
                action: 'Get template metadata',

            },
            {
                name: 'Get Upload URL',
                value: 'getUploadUrl',
                description: 'Get a fresh upload URL to upload or replace the template file',
                action: 'Get template upload URL',

            },
            {
                name: 'List (Deprecated)',
                value: 'list',
                description: 'Deprecated: list templates with embedded project data',
                action: 'List templates',

            },
            {
                name: 'List Compositions',
                value: 'listCompositions',
                description: 'List discovered compositions for a template',
                action: 'List template compositions',

            },
            {
                name: 'List Layers',
                value: 'listLayers',
                description: 'List discovered layers for a template',
                action: 'List template layers',

            },
            {
                name: 'List Metadata',
                value: 'listMetadata',
                description: 'List lightweight template metadata',
                action: 'List template metadata',

            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update a template',
                action: 'Update template',

            },
        ],
        default: 'list',
    },
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['job'],
            },
        },
        options: [
            {
                name: 'Cancel',
                value: 'cancel',
                description: 'Cancel a queued or pending job',
                action: 'Cancel job',
            },
            {
                name: 'Cancel Many',
                value: 'cancelMany',
                description: 'Cancel multiple queued or pending jobs',
                action: 'Cancel many jobs',
            },
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new job',
                action: 'Create job',
            },
            {
                name: 'Create Join Job',
                value: 'join',
                description: 'Create a join or stitch job',
                action: 'Create join job',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a job by ID',
                action: 'Get job',
            },
            {
                name: 'Get Logs',
                value: 'getLogs',
                description: 'Get the stored render log for a job',
                action: 'Get job logs',
            },
            {
                name: 'List',
                value: 'list',
                description: 'List jobs',
                action: 'List jobs',
            },
        ],
        default: 'list',
    },
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['font'],
            },
        },
        options: [
            {
                name: 'Upload',
                value: 'upload',
                description: 'Upload a new font',
                action: 'Upload font',
            },
            {
                name: 'List',
                value: 'list',
                description: 'List fonts',
                action: 'List fonts',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a font by ID',
                action: 'Get font',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a font',
                action: 'Delete font',
            },
        ],
        default: 'list',
    },
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['secret'],
            },
        },
        options: [
            {
                name: 'List',
                value: 'list',
                description: 'List secrets',
                action: 'List secrets',
            },
            {
                name: 'Create',
                value: 'create',
                description: 'Create or update secret',
                action: 'Create secret',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete secret',
                action: 'Delete secret',
            },
        ],
        default: 'list',
    },
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['batch'],
            },
        },
        options: [
            {
                name: 'Cancel',
                value: 'cancel',
                description: 'Cancel all cancellable jobs in a batch',
                action: 'Cancel batch',
            },
            {
                name: 'Create',
                value: 'create',
                description: 'Create a batch of jobs',
                action: 'Create batch',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get batch status and jobs',
                action: 'Get batch',
            },
        ],
        default: 'get',
    },
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['team'],
            },
        },
        options: [
            {
                name: 'Get',
                value: 'get',
                description: 'Get the team that owns the API token, including its trial allowance',
                action: 'Get team',
            },
        ],
        default: 'get',
    },
];

const templateFields: INodeProperties[] = [
    {
        displayName: 'ID',
        name: 'templateId',
        type: 'string',
        default: '',
        description: 'Template ID',
        displayOptions: {
            show: {
                resource: ['template'],
                operation: ['get', 'delete', 'update', 'getDownloadUrl', 'getUploadUrl', 'getMetadata', 'listCompositions', 'listLayers'],
            },
        },
        required: true,
    },
    {
        displayName: 'Body',
        name: 'body',
        type: 'json',
        default: '{"type":"aep","displayName":"My Template"}',
        description: 'Template payload. The display name can be at most 255 characters.',
        displayOptions: {
            show: {
                resource: ['template'],
                operation: ['create', 'update'],
            },
        },
        // routing via operation's request.body binding
    },
];

const templatePaginationFields: INodeProperties[] = [
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        typeOptions: { minValue: 1 },
        default: 50,
        description: 'Max number of results to return',
        displayOptions: {
            show: {
                resource: ['template'],
                operation: ['listCompositions', 'listLayers'],
            },
        },
    },
    {
        displayName: 'Offset',
        name: 'offset',
        type: 'number',
        typeOptions: { minValue: 0 },
        default: 0,
        description: 'Number of items to skip before returning results',
        displayOptions: {
            show: {
                resource: ['template'],
                operation: ['listCompositions', 'listLayers'],
            },
        },
    },
];

const jobFields: INodeProperties[] = [
    {
        displayName: 'ID',
        name: 'jobId',
        type: 'string',
        default: '',
        description: 'Job ID',
        displayOptions: {
            show: {
                resource: ['job'],
                operation: ['get', 'getLogs', 'cancel'],
            },
        },
        required: true,
    },
    {
        displayName: 'Wait Until Finished/Error',
        name: 'waitUntilDone',
        type: 'boolean',
        default: false,
    description: 'Whether to poll the job status until it is finished or error',
        displayOptions: {
            show: {
                resource: ['job'],
                operation: ['get'],
            },
        },
    },
    {
        displayName: 'Poll Interval (Seconds)',
        name: 'pollIntervalSeconds',
        type: 'number',
        typeOptions: { minValue: 1 },
        default: 5,
        description: 'Time between status checks',
        displayOptions: {
            show: {
                resource: ['job'],
                operation: ['get'],
                waitUntilDone: [true],
            },
        },
    },
    {
        displayName: 'Timeout (Minutes)',
        name: 'timeoutMinutes',
        type: 'number',
        typeOptions: { minValue: 1 },
        default: 30,
        description: 'Maximum time to wait before failing',
        displayOptions: {
            show: {
                resource: ['job'],
                operation: ['get'],
                waitUntilDone: [true],
            },
        },
    },
    {
        displayName: 'Body',
        name: 'body',
        type: 'json',
        default: '{"template":{"id":"01ARZ3NDEKTSV4RRFFQ69G5FAV","composition":"Main"},"assets":[]}',
        description: 'Job creation payload. Point the template at an uploaded template by its ID, or at a template URL with template.src and template.name. settings.type can be video, image, aep or lottie.',
        displayOptions: {
            show: {
                resource: ['job'],
                operation: ['create'],
            },
        },
        // routing via operation's request.body binding
    },
    {
        displayName: 'Body',
        name: 'body',
        type: 'json',
        default: '{"jobs":["01ARZ3NDEKTSV4RRFFQ69G5FAV"]}',
        description: 'Job cancellation payload',
        displayOptions: {
            show: {
                resource: ['job'],
                operation: ['cancelMany'],
            },
        },
    },
    {
        displayName: 'Body',
        name: 'body',
        type: 'json',
        default: '{"assets":[{"type":"video","src":"https://example.com/part1.mp4"},{"type":"video","src":"https://example.com/part2.mp4"}]}',
        description: 'Join job creation payload. A join needs at least two assets.',
        displayOptions: {
            show: {
                resource: ['job'],
                operation: ['join'],
            },
        },
    },
    {
        displayName: 'Query Parameters',
        name: 'query',
        type: 'fixedCollection',
        default: {},
        typeOptions: { multipleValues: true },
        displayOptions: {
            show: {
                resource: ['job'],
                operation: ['list'],
            },
        },
        options: [
                    {
                        name: 'keyvalue',
                        displayName: 'Key:Value',
                        values: [
                            { displayName: 'Key', name: 'key', type: 'string', default: '' },
                            {
                                displayName: 'Value',
                                name: 'value',
                                type: 'string',
                                default: '',
                            },
                        ],
                    },
        ],
    },
];

const batchFields: INodeProperties[] = [
    {
        displayName: 'ID',
        name: 'batchId',
        type: 'string',
        default: '',
        description: 'Batch ID',
        displayOptions: {
            show: {
                resource: ['batch'],
                operation: ['get', 'cancel'],
            },
        },
        required: true,
    },
    {
        displayName: 'Body',
        name: 'body',
        type: 'json',
        default: '{"jobs":[{"template":{"id":"01ARZ3NDEKTSV4RRFFQ69G5FAV","composition":"Main"},"assets":[]}]}',
        description: 'Batch creation payload with 1 to 1000 jobs. Each job can set an optional batchItemId to identify it when the batch is retried.',
        displayOptions: {
            show: {
                resource: ['batch'],
                operation: ['create'],
            },
        },
    },
    {
        displayName: 'Options',
        name: 'batchOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
            show: {
                resource: ['batch'],
                operation: ['create'],
            },
        },
        options: [
            {
                displayName: 'Batch ID',
                name: 'batchId',
                type: 'string',
                default: '',
                placeholder: '01ARZ3NDEKTSV4RRFFQ69G5FAV',
                description: 'ULID you choose for the batch. Sending the same batch again with this ID creates only the jobs that are missing, so it is safe to retry. Overrides batchId in the body.',
            },
            {
                displayName: 'Max Retries',
                name: 'maxRetries',
                type: 'number',
                typeOptions: { minValue: 0, maxValue: 10 },
                default: 3,
                description: 'How many times to retry when the API says the batch was only partly created because of a temporary failure. Retries reuse the batch ID, so no job is created twice. Set to 0 to turn this off.',
            },
        ],
    },
];

const fontFields: INodeProperties[] = [
    {
        displayName: 'ID',
        name: 'fontId',
        type: 'string',
        default: '',
        description: 'Font ID',
        displayOptions: {
            show: {
                resource: ['font'],
                operation: ['get', 'delete'],
            },
        },
        required: true,
    },
    {
        displayName: 'Binary Property',
        name: 'binaryPropertyName',
        type: 'string',
        default: 'data',
        placeholder: 'data',
        description: 'Name of the binary property that contains the font file (e.g. from a previous node)',
        displayOptions: {
            show: {
                resource: ['font'],
                operation: ['upload'],
            },
        },
        required: true,
    },
    {
        displayName: 'Family Name',
        name: 'familyName',
        type: 'string',
        default: '',
        description: 'Optional font family name override (multipart field)',
        displayOptions: {
            show: {
                resource: ['font'],
                operation: ['upload'],
            },
        },
    },
];

const secretFields: INodeProperties[] = [
    {
        displayName: 'ID',
        name: 'secretId',
        type: 'string',
								typeOptions: { password: true },
        default: '',
        description: 'Secret ID',
        displayOptions: { show: { resource: ['secret'], operation: ['delete'] } },
        required: true,
    },
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Secret name/key',
        displayOptions: { show: { resource: ['secret'], operation: ['create'] } },
        required: true,
    },
    {
        displayName: 'Value',
        name: 'value',
        type: 'string',
        typeOptions: { password: true },
        default: '',
        description: 'Secret value',
        displayOptions: { show: { resource: ['secret'], operation: ['create'] } },
        required: true,
    },
];

export const nexrenderFields: INodeProperties[] = [
    {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
            { name: 'Batch', value: 'batch' },
            { name: 'Font', value: 'font' },
            { name: 'Job', value: 'job' },
            { name: 'Secret', value: 'secret' },
            { name: 'Team', value: 'team' },
            { name: 'Template', value: 'template' },
        ],
        default: 'job',
    },

    ...templateFields,
    ...templatePaginationFields,
    ...jobFields,
    ...batchFields,
    ...fontFields,
    ...secretFields,
];
