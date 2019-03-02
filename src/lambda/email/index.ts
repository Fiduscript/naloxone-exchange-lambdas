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

handler({
    'Records': [
        {
            'eventID': 'c4ca4238a0b923820dcc509a6f75849b',
            'eventName': 'INSERT',
            'eventVersion': '1.1',
            'eventSource': 'aws:dynamodb',
            'awsRegion': 'us-east-2',
            'dynamodb': {
                'Keys': {
                    'Id': {
                        'N': '101'
                    }
                },
                'NewImage': {
                    'attributionSource': {
                        'S': 'Facebook Advertisement'
                    },
                    'contactEmail': {
                        'S': 'lars@fidsucript.com'
                    },
                    'contactName': {
                        'S': 'Lars'
                    },
                    'contactPhoneNumber': {
                        'S': '4257607453'
                    },
                    'createdAt': {
                        'S': '2019-02-19T06:36:06.430Z'
                    },
                    'id': {
                        'S': 'f66672cf-480a-408d-9866-ac478da30296'
                    },
                    'message': {
                        'S': 'Lasdflkjasdlfkjsadlfkjlsdkjflaskdjf'
                    },
                    'needByDate': {
                        'S': 'Within the next 3 business days'
                    },
                    'organizationName': {
                        'S': 'Fiduscript'
                    },
                    'organizationType': {
                        'S': 'Test'
                    },
                    'paidByGrant': {
                        'S': 'false'
                    },
                    'preferredContactType': {
                        'S': 'email'
                    },
                    'quantityRange': {
                        'S': '1-50'
                    },
                    'requestedProductId': {
                        'S': 'narcan-1'
                    },
                    'shippingAddress': {
                        'M': {
                            'city': {
                                'S': 'Stanwood'
                            },
                            'name': {
                                'S': 'Fiduscript'
                            },
                            'state': {
                                'S': 'Washington'
                            },
                            'street1': {
                                'S': '555'
                            },
                            'street2': {
                                'NULL': true
                            },
                            'zip': {
                                'S': '98115'
                            }
                        }
                    },
                    'signeeName': {
                        'S': 'Lars'
                    },
                    'version': {
                        'N': '0'
                    }
                },
                'ApproximateCreationDateTime': 1428537600,
                'SequenceNumber': '4421584500000000017450439091',
                'SizeBytes': 26,
                'StreamViewType': 'NEW_AND_OLD_IMAGES'
            },
            'eventSourceARN': 'arn:aws:dynamodb:us-east-2:123456789012:table/ExampleTableWithStream/stream/2015-06-27T00:48:05.899'
        },
        {
            'eventID': 'c81e728d9d4c2f636f067f89cc14862c',
            'eventName': 'MODIFY',
            'eventVersion': '1.1',
            'eventSource': 'aws:dynamodb',
            'awsRegion': 'us-east-2',
            'dynamodb': {
                'Keys': {
                    'Id': {
                        'N': '101'
                    }
                },
                'NewImage': {
                    'attributionSource': {
                        'S': 'Facebook Advertisement'
                    },
                    'contactEmail': {
                        'S': 'lars@fidsucript.com'
                    },
                    'contactName': {
                        'S': 'Lars'
                    },
                    'contactPhoneNumber': {
                        'S': '4257607453'
                    },
                    'createdAt': {
                        'S': '2019-02-19T06:36:06.430Z'
                    },
                    'id': {
                        'S': 'f66672cf-480a-408d-9866-ac478da30296'
                    },
                    'message': {
                        'S': 'Lasdflkjasdlfkjsadlfkjlsdkjflaskdjf'
                    },
                    'needByDate': {
                        'S': 'Within the next 3 business days'
                    },
                    'organizationName': {
                        'S': 'Fiduscript'
                    },
                    'organizationType': {
                        'S': 'Test'
                    },
                    'paidByGrant': {
                        'S': 'false'
                    },
                    'preferredContactType': {
                        'S': 'email'
                    },
                    'quantityRange': {
                        'S': '1-50'
                    },
                    'requestedProductId': {
                        'S': 'narcan-1'
                    },
                    'shippingAddress': {
                        'M': {
                            'city': {
                                'S': 'Stanwood'
                            },
                            'name': {
                                'S': 'Fiduscript'
                            },
                            'state': {
                                'S': 'Washington'
                            },
                            'street1': {
                                'S': '555'
                            },
                            'street2': {
                                'NULL': true
                            },
                            'zip': {
                                'S': '98115'
                            }
                        }
                    },
                    'signeeName': {
                        'S': 'Lars'
                    },
                    'version': {
                        'N': '0'
                    }
                },
                'OldImage': {
                    'attributionSource': {
                        'S': 'Facebook Advertisement'
                    },
                    'contactEmail': {
                        'S': 'lars@fidsucript.com'
                    },
                    'contactName': {
                        'S': 'Lars'
                    },
                    'contactPhoneNumber': {
                        'S': '4257607453'
                    },
                    'createdAt': {
                        'S': '2019-02-19T06:36:06.430Z'
                    },
                    'id': {
                        'S': 'f66672cf-480a-408d-9866-ac478da30296'
                    },
                    'message': {
                        'S': 'Lasdflkjasdlfkjsadlfkjlsdkjflaskdjf'
                    },
                    'needByDate': {
                        'S': 'Within the next 3 business days'
                    },
                    'organizationName': {
                        'S': 'Fiduscript'
                    },
                    'organizationType': {
                        'S': 'Test'
                    },
                    'paidByGrant': {
                        'S': 'false'
                    },
                    'preferredContactType': {
                        'S': 'email'
                    },
                    'quantityRange': {
                        'S': '1-50'
                    },
                    'requestedProductId': {
                        'S': 'narcan-1'
                    },
                    'shippingAddress': {
                        'M': {
                            'city': {
                                'S': 'Stanwood'
                            },
                            'name': {
                                'S': 'Fiduscript'
                            },
                            'state': {
                                'S': 'Washington'
                            },
                            'street1': {
                                'S': '555'
                            },
                            'street2': {
                                'NULL': true
                            },
                            'zip': {
                                'S': '98115'
                            }
                        }
                    },
                    'signeeName': {
                        'S': 'Lars'
                    },
                    'version': {
                        'N': '0'
                    }
                },
                'ApproximateCreationDateTime': 1428537600,
                'SequenceNumber': '4421584500000000017450439092',
                'SizeBytes': 59,
                'StreamViewType': 'NEW_AND_OLD_IMAGES'
            },
            'eventSourceARN': 'arn:aws:dynamodb:us-east-2:123456789012:table/ExampleTableWithStream/stream/2015-06-27T00:48:05.899'
        }
    ]
}).then( (data) => {
    console.log(data);
}).catch( (err) => {
    console.log(err);
});
