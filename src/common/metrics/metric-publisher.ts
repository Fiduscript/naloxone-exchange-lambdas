import { CloudWatch } from 'aws-sdk/clients/all';
import { IStatusDimension } from '../model/metric/status-dimension';

export class MetricPublisher {
    private static readonly cw: CloudWatch = new CloudWatch({region: 'us-east-2'});
    private readonly domain: string;
    private readonly metricName: string;
    private readonly namespace: string;
    private readonly stage: string;

    constructor(domain: string, metricName: string, namespace: string, stage: string) {
        this.domain = domain;
        this.metricName = metricName;
        this.namespace = namespace;
        this.stage = stage;
    }

    public async postMetrics(statusDimensions: IStatusDimension[]) {
        const params = {
            MetricData: this.getMetricData(statusDimensions),
            Namespace: this.namespace
        };

        await MetricPublisher.cw.putMetricData(<CloudWatch.PutMetricDataInput>params, await ((err: any, data: any) => {
            if (err) {
                console.log(err, err.stack);
                throw new Error(`Unable to save metric [${name} ${this.stage} ${this.domain}]`);
            }
        }));
    }

    private getMetricData(statusDimensions: IStatusDimension[]): any[] {
        if (statusDimensions.length <= 0) {
            throw new Error('Dimension data cannot be empty.');
        }

        return statusDimensions.map( (statusDimension) =>
            this.getDimension(statusDimension)
        );
    }

    private getDimension(statusDimension: IStatusDimension) {
        if (!statusDimension) {
            throw new Error('Dimension data cannot be empty.');
        }

        if (statusDimension.count == null || !statusDimension.status) {
            throw new Error(`Invalid dimension data: [count: ${statusDimension.count}], [status: ${statusDimension.status}]`);
        }

        return {
            Dimensions: [
                {
                    Name: 'Stage',
                    Value: this.stage
                },
                {
                    Name: 'Domain',
                    Value: this.domain
                },
                {
                    Name: 'Status',
                    Value: statusDimension.status,
                }
            ],
            MetricName: this.metricName,
            Unit: 'Count',
            Value: statusDimension.count,
        };
    }
}
