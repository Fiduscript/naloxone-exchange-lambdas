import { SES } from 'aws-sdk/clients/all';
import { IEmailData } from '../model/email/email-data';

export class EmailNotifier {
    private static readonly client: SES = new SES({region: 'us-east-1'});

    private readonly sourceAddress: string;
    private readonly replyAddress: string;

    constructor(sourceAddress: string, replyAddress: string) {
        this.sourceAddress = sourceAddress;
        this.replyAddress = replyAddress;
    }

    public async notify(emailData: IEmailData, toAddresses: string[]): Promise<any> {
        const promise = EmailNotifier.client.sendEmail(this.getEmailOptions(emailData, toAddresses)).promise();
        promise.then(() => {
            console.log('success');
        }).catch((err) => {
            console.log('ERROR', err);
        });
        return promise;
    }

    private getEmailOptions(emailData: IEmailData, toAddresses: string[]): SES.Types.SendEmailRequest {
        return {
            Destination: {
                ToAddresses: toAddresses
            },
            Message: {
                Body: {
                    Text: {
                        Charset: 'UTF-8',
                        Data: emailData.getBody()
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: emailData.subject
                }
            },
            Source: this.sourceAddress,
            ReplyToAddresses: [
                this.replyAddress
            ]
        };
    }
}
