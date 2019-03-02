import { MetricPublisher } from '../../common/metrics/metric-publisher';
import { SlackNotifier } from '../../common/notifier/slack-notifier';

const channelUri = process.env.CHANNEL_URI;
const domain = process.env.DOMAIN;
const hostName = process.env.CHANNEL_HOST_NAME;
const metricName = process.env.METRIC_NAME;
const namespace = process.env.METRIC_NAMESPACE;
const stage = process.env.STAGE;

export const handler = async (event: any = {}): Promise<any> => {
    let success = 0;
    let failure = 0;

    if (!channelUri || !domain || !hostName || !metricName || !namespace || !stage) {
        return Promise.reject('An environment variable is missing: ' +
            'CHANNEL_URI, DOMAIN, CHANNEL_HOST_NAME, METRIC_NAME, METRIC_NAMESPACE, and STAGE are required');
    }

    const publisher = new MetricPublisher(domain, metricName, namespace, stage);
    const notifier = new SlackNotifier(channelUri, hostName);

    await Promise.all(
        event.Records.map(async (record: any) => {
            if (record.eventName !== 'MODIFY') {
                return Promise.resolve();
            }

            try {
                await notifier.notify(`New order received: ${record.dynamodb.NewImage.id.S}]`);
                success++;
            } catch (e) {
                console.log(`Failed to process order [${record.dynamodb.NewImage.id.S}]`);
                failure++;
                return Promise.resolve();
            }
        })
    );

    await publisher.postMetrics([
        {count: success, status: 'Success'},
        {count: failure, status: 'Failure'}
    ]);
    return `Processed ${success + failure} orders. Success [${success}] - Failure [${failure}]`;
};
