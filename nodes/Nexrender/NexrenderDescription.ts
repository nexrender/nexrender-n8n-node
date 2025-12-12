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
                name: 'Get Upload URL',
                value: 'getUploadUrl',
                description: 'Get a fresh upload URL for the template file',
                action: 'Get template upload URL',

            },
            {
                name: 'List',
                value: 'list',
                description: 'List templates',
                action: 'List templates',

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
                name: 'Create',
                value: 'create',
                description: 'Create a new job',
                action: 'Create job',
            },
            {
                name: 'List',
                value: 'list',
                description: 'List jobs',
                action: 'List jobs',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a job by ID',
                action: 'Get job',
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
                operation: ['get', 'delete', 'update', 'getDownloadUrl', 'getUploadUrl'],
            },
        },
        required: true,
    },
    {
        displayName: 'Body',
        name: 'body',
        type: 'json',
        default: '{"type":"aep","displayName":"My Template"}',
        description: 'Template payload',
        displayOptions: {
            show: {
                resource: ['template'],
                operation: ['create', 'update'],
            },
        },
        // routing via operation's request.body binding
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
                operation: ['get'],
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
        default: '',
        description: 'Job creation payload',
        displayOptions: {
            show: {
                resource: ['job'],
                operation: ['create'],
            },
        },
        // routing via operation's request.body binding
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
            { name: 'Template', value: 'template' },
            { name: 'Job', value: 'job' },
            { name: 'Font', value: 'font' },
            { name: 'Secret', value: 'secret' },
        ],
        default: 'job',
    },

    ...templateFields,
    ...jobFields,
    ...fontFields,
    ...secretFields,
];
