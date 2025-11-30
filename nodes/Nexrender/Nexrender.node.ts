import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';
import { nexrenderFields, nexrenderOperations } from './NexrenderDescription';

const log = (string: string) => {
	//process.stdout.write(`${string}\n`);
};

export class Nexrender implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Nexrender',
        name: 'nexrender',
        icon: 'file:icon.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Interact with Nexrender Cloud API',
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
                'Content-Type': 'application/json',
            },
        },
        properties: [
            ...nexrenderOperations,
            ...nexrenderFields,
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const results: INodeExecutionData[] = [];

        // Extract a concise API error message, preferring a returned `error` field when present
        const getApiErrorMessage = (err: unknown): string => {
            const e: any = err as any;
            const safeParse = (s: string) => {
                try { return JSON.parse(s); } catch { return undefined; }
            };
            const fromBody = (body: unknown) => {
                if (!body) return undefined;
                const obj = typeof body === 'string' ? safeParse(body) ?? { message: body } : body;
                if (obj && typeof obj === 'object') {
                    const msg = (obj as any).error || (obj as any).message || (obj as any).detail;
                    if (typeof msg === 'string' && msg.trim().length) return msg;
                    try { return JSON.stringify(obj); } catch { /* noop */ }
                }
                return undefined;
            };

            const status = e?.statusCode ?? e?.status ?? e?.response?.status ?? e?.cause?.response?.status;
            const bodies = [
                e?.response?.data,
                e?.response?.body,
                e?.error,
                e?.cause?.response?.data,
                e?.cause?.response?.body,
            ];
            let msg = bodies.map(fromBody).find((m) => typeof m === 'string');
            if (!msg) msg = e?.message || 'Request failed';
            return status ? `HTTP ${status}: ${msg}` : String(msg);
        };

        for (let i = 0; i < items.length; i++) {
            const resource = this.getNodeParameter('resource', i) as string;
            const operation = this.getNodeParameter('operation', i) as string;
            const creds = (await this.getCredentials('nexrenderApi')) as { domain?: string } | null;
            const baseURL = (creds?.domain as string) || 'https://api.nexrender.com/api/v2';

            // Lightweight debug logging to help trace execution without changing behavior
            try {
                log(
                    `[Nexrender] item ${i}: resource=${resource} operation=${operation} baseURL=${baseURL}`,
                );
            } catch {}

            try {
                if (resource === 'job' && operation === 'get') {
                    const jobId = this.getNodeParameter('jobId', i) as string;
                    const waitUntilDone = this.getNodeParameter('waitUntilDone', i, false) as boolean;

                    if (!waitUntilDone) {
                        // Single GET passthrough using credentials
                        try {
                            log(
                                `[Nexrender] item ${i}: GET job id=${jobId}`,
                            );
                        } catch {}
                        const body = await this.helpers.httpRequestWithAuthentication.call(this, 'nexrenderApi', {
                            method: 'GET',
                            url: `/jobs/${jobId}`,
                            baseURL,
                            headers: { Accept: 'application/json' },
                            json: true,
                        });
                        results.push({ json: body });
                        continue;
                    }

                    const pollIntervalSeconds = this.getNodeParameter('pollIntervalSeconds', i, 5) as number;
                    const timeoutMinutes = this.getNodeParameter('timeoutMinutes', i, 30) as number;

                    const pollIntervalMs = Math.max(1, pollIntervalSeconds) * 1000;
                    const timeoutMs = Math.max(1, timeoutMinutes) * 60_000;
                    const deadline = Date.now() + timeoutMs;

                    let last: any = undefined;
                    // eslint-disable-next-line no-constant-condition
                    while (true) {
                        last = await this.helpers.httpRequestWithAuthentication.call(this, 'nexrenderApi', {
                            method: 'GET',
                            url: `/jobs/${jobId}`,
                            baseURL,
                            headers: { Accept: 'application/json' },
                            json: true,
                        });

                        const status = last?.status as string | undefined;
                        try {
                            (this as any).logger?.debug?.(
                                `[Nexrender] item ${i}: polled job id=${jobId} status=${status ?? 'unknown'}`,
                            );
                        } catch {}
                        if (status === 'finished' || status === 'error') break;

                        if (Date.now() > deadline) {
                            throw new NodeOperationError(this.getNode(), `Timed out waiting for job ${jobId} after ${timeoutMinutes} minutes`, { itemIndex: i });
                        }

                        await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
                    }

                    results.push({ json: last });
                    continue;
                }

                // Handle all other operations explicitly
                if (resource === 'job' && operation === 'create') {
                    const bodyParam = this.getNodeParameter('body', i) as unknown;
                    const payload = typeof bodyParam === 'string' ? JSON.parse(bodyParam) : bodyParam;
                    const body = await this.helpers.httpRequestWithAuthentication.call(this, 'nexrenderApi', {
                        method: 'POST',
                        url: '/jobs',
                        baseURL,
                        json: true,
                        body: payload,
                        headers: { Accept: 'application/json' },
                    });
                    results.push({ json: body });
                    continue;
                }

                if (resource === 'job' && operation === 'list') {
                    const qp = (this.getNodeParameter('query', i, {}) as any)?.keyvalue ?? [];
                    const qs: Record<string, string> = {};
                    for (const kv of qp) if (kv.key) qs[kv.key] = kv.value ?? '';
                    const body = await this.helpers.httpRequestWithAuthentication.call(this, 'nexrenderApi', {
                        method: 'GET',
                        url: '/jobs',
                        baseURL,
                        qs,
                        json: true,
                        headers: { Accept: 'application/json' },
                    });
                    results.push({ json: body });
                    continue;
                }

                if (resource === 'template') {
                    if (operation === 'create') {
                        const bodyParam = this.getNodeParameter('body', i) as unknown;
                        const payload = typeof bodyParam === 'string' ? JSON.parse(bodyParam) : bodyParam;
                        const resp = await this.helpers.httpRequestWithAuthentication.call(this, 'nexrenderApi', {
                            method: 'POST',
                            url: '/templates',
                            baseURL,
                            json: true,
                            body: payload,
                            headers: { Accept: 'application/json' },
                        });
                        results.push({ json: resp });
                        continue;
                    }
                    if (operation === 'list') {
                        const resp = await this.helpers.httpRequestWithAuthentication.call(this, 'nexrenderApi', {
                            method: 'GET', url: '/templates', baseURL, json: true, headers: { Accept: 'application/json' },
                        });
                        results.push({ json: resp });
                        continue;
                    }
                    const templateId = this.getNodeParameter('templateId', i, '') as string;
                    if (operation === 'get') {
                        const resp = await this.helpers.httpRequestWithAuthentication.call(this, 'nexrenderApi', {
                            method: 'GET', url: `/templates/${templateId}`, baseURL, json: true, headers: { Accept: 'application/json' },
                        });
                        results.push({ json: resp });
                        continue;
                    }
                    if (operation === 'delete') {
                        const resp = await this.helpers.httpRequestWithAuthentication.call(this, 'nexrenderApi', {
                            method: 'DELETE', url: `/templates/${templateId}`, baseURL, json: true, headers: { Accept: 'application/json' },
                        });
                        results.push({ json: resp ?? { success: true } });
                        continue;
                    }
                    if (operation === 'update') {
                        const bodyParam = this.getNodeParameter('body', i) as unknown;
                        const payload = typeof bodyParam === 'string' ? JSON.parse(bodyParam) : bodyParam;
                        const resp = await this.helpers.httpRequestWithAuthentication.call(this, 'nexrenderApi', {
                            method: 'PATCH', url: `/templates/${templateId}`, baseURL, json: true, body: payload, headers: { Accept: 'application/json' },
                        });
                        results.push({ json: resp });
                        continue;
                    }
                    if (operation === 'getDownloadUrl') {
                        const resp = await this.helpers.httpRequestWithAuthentication.call(this, 'nexrenderApi', {
                            method: 'GET', url: `/templates/${templateId}/upload`, baseURL, json: true, headers: { Accept: 'application/json' },
                        });
                        results.push({ json: resp });
                        continue;
                    }
                    if (operation === 'getUploadUrl') {
                        const resp = await this.helpers.httpRequestWithAuthentication.call(this, 'nexrenderApi', {
                            method: 'PUT', url: `/templates/${templateId}/upload`, baseURL, json: true, headers: { Accept: 'application/json' },
                        });
                        results.push({ json: resp });
                        continue;
                    }
                }

                if (resource === 'font') {
                    if (operation === 'list') {
                        const resp = await this.helpers.httpRequestWithAuthentication.call(this, 'nexrenderApi', {
                            method: 'GET', url: '/fonts', baseURL, json: true, headers: { Accept: 'application/json' },
                        });
                        results.push({ json: resp });
                        continue;
                    }
                    if (operation === 'get' || operation === 'delete') {
                        const fontId = this.getNodeParameter('fontId', i, '') as string;
                        const method = operation === 'get' ? 'GET' : 'DELETE';
                        const resp = await this.helpers.httpRequestWithAuthentication.call(this, 'nexrenderApi', {
                            method, url: `/fonts/${fontId}`, baseURL, json: true, headers: { Accept: 'application/json' },
                        });
                        results.push({ json: resp ?? { success: true } });
                        continue;
                    }
                    if (operation === 'upload') {
                        // Multipart/form-data upload using binary data from previous nodes
                        const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
                        const familyName = this.getNodeParameter('familyName', i, '') as string;

                        const item = items[i];
                        if (!item.binary || !item.binary[binaryPropertyName]) {
                            throw new NodeOperationError(this.getNode(), `No binary data found under property '${binaryPropertyName}'`, { itemIndex: i });
                        }
                        const binaryData = item.binary[binaryPropertyName]!;

                        // Prepare form-data: field 'font' is the file; optional 'familyName'
                        const formData: any = {
                            font: {
                                value: await this.helpers.getBinaryDataBuffer(i, binaryPropertyName),
                                options: {
                                    filename: binaryData.fileName || 'font.ttf',
                                    contentType: binaryData.mimeType || 'application/octet-stream',
                                },
                            },
                        };
                        if (familyName) formData.familyName = familyName;

												try {
													const resp = await this.helpers.httpRequestWithAuthentication.call(this, 'nexrenderApi', {
															method: 'POST',
															url: '/fonts',
															baseURL,
															formData,
															headers: { Accept: 'application/json' },
													} as any);
													results.push({ json: typeof resp === 'string' ? { success: true, ...JSON.parse(resp) } : resp });
													continue;
												} catch (error) {
													throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
												}
                    }
                }

                if (resource === 'secret') {
                    if (operation === 'list') {
                        const resp = await this.helpers.httpRequestWithAuthentication.call(this, 'nexrenderApi', {
                            method: 'GET', url: '/secrets', baseURL, json: true, headers: { Accept: 'application/json' },
                        });
                        results.push({ json: resp });
                        continue;
                    }
                    if (operation === 'create') {
                        const name = this.getNodeParameter('name', i) as string;
                        const value = this.getNodeParameter('value', i) as string;
                        const resp = await this.helpers.httpRequestWithAuthentication.call(this, 'nexrenderApi', {
                            method: 'PUT', url: '/secrets', baseURL, json: true, body: { name, value }, headers: { Accept: 'application/json' },
                        });
                        results.push({ json: resp ?? { success: true } });
                        continue;
                    }
                    if (operation === 'delete') {
                        const secretId = this.getNodeParameter('secretId', i, '') as string;
                        const resp = await this.helpers.httpRequestWithAuthentication.call(this, 'nexrenderApi', {
                            method: 'DELETE', url: `/secrets/${secretId}`, baseURL, json: true, headers: { Accept: 'application/json' },
                        });
                        results.push({ json: resp ?? { success: true } });
                        continue;
                    }
                }

                throw new NodeOperationError(this.getNode(), `Operation not implemented: ${resource}.${operation}`, { itemIndex: i });
            } catch (error) {
                const message = getApiErrorMessage(error);
                if (this.continueOnFail()) {
                    results.push({ json: { error: message }, pairedItem: i });
                } else {
                    throw new NodeOperationError(this.getNode(), message, { itemIndex: i });
                }
            }
        }

        return [results];
    }
}
