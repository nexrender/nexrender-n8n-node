import type {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

export class NexrenderWaitForJob implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Nexrender: Wait For Job',
        name: 'nexrenderWaitForJob',
        icon: 'file:icon.svg',
        group: ['transform'],
        version: 1,
        description: 'Poll a Nexrender job until it finishes or errors',
        defaults: { name: 'Nexrender: Wait For Job' },
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
        usableAsTool: true,
        credentials: [
            {
                name: 'nexrenderApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Job ID',
                name: 'jobId',
                type: 'string',
                default: '',
                description: 'ULID of the job to poll',
                required: true,
            },
            {
                displayName: 'Poll Interval (Seconds)',
                name: 'pollIntervalSeconds',
                type: 'number',
                typeOptions: { minValue: 1 },
                default: 5,
                description: 'Time between status checks',
            },
            {
                displayName: 'Timeout (Minutes)',
                name: 'timeoutMinutes',
                type: 'number',
                typeOptions: { minValue: 1 },
                default: 30,
                description: 'Maximum time to wait before failing',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const results: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            const jobId = this.getNodeParameter('jobId', i, '') as string;
            const pollIntervalSeconds = this.getNodeParameter('pollIntervalSeconds', i, 5) as number;
            const timeoutMinutes = this.getNodeParameter('timeoutMinutes', i, 30) as number;

            const pollIntervalMs = Math.max(1, pollIntervalSeconds) * 1000;
            const timeoutMs = Math.max(1, timeoutMinutes) * 60_000;
            const deadline = Date.now() + timeoutMs;

            let last: any = undefined;

            try {
                // eslint-disable-next-line no-constant-condition
                while (true) {
                    last = await this.helpers.requestWithAuthentication.call(this, 'nexrenderApi', {
                        method: 'GET',
                        url: `=/jobs/${jobId}`,
                        baseURL: '={{$credentials.domain}}',
                        headers: { Accept: 'application/json' },
                        json: true,
                    });

                    const status = last?.status as string | undefined;
                    if (status === 'finished' || status === 'error') break;

                    if (Date.now() > deadline) {
                        throw new NodeOperationError(this.getNode(), `Timed out waiting for job ${jobId} after ${timeoutMinutes} minutes`, { itemIndex: i });
                    }

                    await new Promise((resolve) => (globalThis as any).setTimeout(resolve, pollIntervalMs));
                }

                results.push({ json: last });
            } catch (error) {
                if (this.continueOnFail()) {
                    results.push({ json: { jobId, error: (error as Error).message }, pairedItem: i });
                } else {
                    throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
                }
            }
        }

        return [results];
    }
}
