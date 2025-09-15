import {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class NexrenderApi implements ICredentialType {
    name = 'nexrenderApi';
    displayName = 'Nexrender API';
    documentationUrl = 'https://docs.nexrender.com';

    properties: INodeProperties[] = [
        {
            displayName: 'API Token',
            name: 'token',
            type: 'string',
            default: '',
            typeOptions: {
                password: true,
            },
            description: 'Bearer API token for the Nexrender API',
        },
        {
            displayName: 'Base URL',
            name: 'domain',
            type: 'string',
            default: 'https://api.nexrender.com/api/v2',
            description: 'Base URL for the Nexrender API',
        },
    ];

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '={{"Bearer " + $credentials.token}}',
            },
        },
    };

    test: ICredentialTestRequest = {
        request: {
            baseURL: '={{$credentials?.domain}}',
            url: '/jobs',
            method: 'GET',
        },
    };
}
