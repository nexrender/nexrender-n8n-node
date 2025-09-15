import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';
import { nexrenderFields, nexrenderOperations } from './NexrenderDescription';

export class Nexrender implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Nexrender',
        name: 'nexrender',
        icon: 'file:icon.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Interact with Nexrender API',
        defaults: {
            name: 'Nexrender',
        },
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
        usableAsTool: true,
        credentials: [
            {
                name: 'nexrenderApi',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: '={{$credentials.domain}}',
            url: '',
            headers: {
                Accept: 'application/json',
            },
        },
        properties: [
            ...nexrenderOperations,
            ...nexrenderFields,
        ],
    };
}
