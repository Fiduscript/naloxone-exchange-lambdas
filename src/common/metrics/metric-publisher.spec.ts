import chai from 'chai';
import { expect, should } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { MetricPublisher } from './metric-publisher';

chai.use(chaiAsPromised);
should();

const domain = 'domain';
const metricName = 'metricName';
const namespace = 'namespace';
const stage = 'stage';

const mockStatusData = [
    {count: 1, status: 'Success'},
    {count: 0, status: 'Failure'}
];

describe('Metric publish', () => {

    it('MetricPublisher postMetrics success', () => {
        const metricPublisher = new MetricPublisher(domain, metricName, namespace, stage);
        return metricPublisher.postMetrics(mockStatusData).should.be.fulfilled;
    });

    it('MetricPublisher postMetrics empty data should fail', () => {
        const metricPublisher = new MetricPublisher(domain, metricName, namespace, stage);
        const promise = metricPublisher.postMetrics([]);
        return promise.should.not.be.fulfilled;
    });
});
