import { MetricPublisher } from '../../common/metrics/metric-publisher';
import { BusinessEmailData } from '../../common/model/email/email-data';
import { EmailNotifier } from '../../common/notifier/email-notifier';

const domain = process.env.DOMAIN;
const metricName = process.env.METRIC_NAME;
const namespace = process.env.METRIC_NAMESPACE;
const stage = process.env.STAGE;

export const handler = async (event: any = {}): Promise<any> => {
    let success = 0;
    let failure = 0;

    if (!domain || !metricName || !namespace || !stage) {
        return Promise.reject('An environment variable is missing: ' +
            'DOMAIN, METRIC_NAME, METRIC_NAMESPACE, and STAGE are required');
    }

    const publisher = new MetricPublisher(domain, metricName, namespace, stage);
    const notifier = new EmailNotifier('info@fiduscript.com', 'info@fiduscript.com');

    await Promise.all(
        event.Records.map(async (record: any) => {
            if (record.eventName !== 'MODIFY') {
                return Promise.resolve();
            }

            try {
                await notifier.notify(new BusinessEmailData(record.dynamodb.NewImage.id.S, 'Test Subject'), ['lars@fiduscript.com']);
                success++;
                failure++;
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
    ]).catch( (err) => {
        console.log(err);
    });
    return `Processed ${success + failure} orders. Success [${success}] - Failure [${failure}]`;
};
