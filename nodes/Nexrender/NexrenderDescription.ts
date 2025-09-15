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
                routing: { request: { method: 'POST', url: '/templates' } },
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a template',
                action: 'Delete template',
                routing: { request: { method: 'DELETE', url: '=/templates/{{$parameter["templateId"]}}' } },
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a template by ID',
                action: 'Get template',
                routing: { request: { method: 'GET', url: '=/templates/{{$parameter["templateId"]}}' } },
            },
            {
                name: 'Get Download URL',
                value: 'getDownloadUrl',
                description: 'Get a presigned download URL for the template file',
                action: 'Get template download URL',
                routing: { request: { method: 'GET', url: '=/templates/{{$parameter["templateId"]}}/upload' } },
            },
            {
                name: 'Get Upload URL',
                value: 'getUploadUrl',
                description: 'Get a fresh upload URL for the template file',
                action: 'Get template upload URL',
                routing: { request: { method: 'PUT', url: '=/templates/{{$parameter["templateId"]}}/upload' } },
            },
            {
                name: 'List',
                value: 'list',
                description: 'List templates',
                action: 'List templates',
                routing: { request: { method: 'GET', url: '/templates' } },
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update a template',
                action: 'Update template',
                routing: { request: { method: 'PATCH', url: '=/templates/{{$parameter["templateId"]}}' } },
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
                routing: {
                    request: {
                        method: 'POST',
                        url: '/jobs',
                    },
                },
            },
            {
                name: 'List',
                value: 'list',
                description: 'List jobs',
                action: 'List jobs',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/jobs',
                    },
                },
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a job by ID',
                action: 'Get job',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/jobs/{{$parameter["jobId"]}}',
                    },
                },
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
                routing: {
                    request: {
                        method: 'POST',
                        url: '/fonts',
                    },
                },
            },
            {
                name: 'List',
                value: 'list',
                description: 'List fonts',
                action: 'List fonts',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/fonts',
                    },
                },
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a font by ID',
                action: 'Get font',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/fonts/{{$parameter["fontId"]}}',
                    },
                },
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a font',
                action: 'Delete font',
                routing: {
                    request: {
                        method: 'DELETE',
                        url: '=/fonts/{{$parameter["fontId"]}}',
                    },
                },
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
                routing: {
                    request: {
                        method: 'GET',
                        url: '/secrets',
                    },
                },
            },
            {
                name: 'Create',
                value: 'create',
                description: 'Create or update secret',
                action: 'Create secret',
                routing: {
                    request: {
                        method: 'PUT',
                        url: '/secrets',
                    },
                },
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete secret',
                action: 'Delete secret',
                routing: {
                    request: {
                        method: 'DELETE',
                        url: '=/secrets/{{$parameter["secretId"]}}',
                    },
                },
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
        routing: {
            send: {
                property: 'body',
                type: 'body',
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
                operation: ['get'],
            },
        },
        required: true,
    },
    {
        displayName: 'Body',
        name: 'body',
        type: 'json',
        default: '{"template":{"id":"TEMPLATE_ULID"}}',
        description: 'Job creation payload',
        displayOptions: {
            show: {
                resource: ['job'],
                operation: ['create'],
            },
        },
        routing: {
            send: {
                property: 'body',
                type: 'body',
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
                        routing: { send: { property: '={{$parent.key}}', type: 'query' } },
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
        displayName: 'Family Name',
        name: 'familyName',
        type: 'string',
        default: '',
        description: 'Optional font family name override',
        displayOptions: {
            show: {
                resource: ['font'],
                operation: ['upload'],
            },
        },
    },
    {
        displayName: 'Font File',
        name: 'font',
        type: 'string',
        default: '',
        description: 'Binary data reference or URL to TTF font',
        displayOptions: {
            show: {
                resource: ['font'],
                operation: ['upload'],
            },
        },
        routing: {
            send: {
                property: 'font',
                type: 'body',
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
        routing: { send: { property: 'name', type: 'body' } },
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
        routing: { send: { property: 'value', type: 'body' } },
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
