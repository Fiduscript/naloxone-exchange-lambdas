import request from 'request-promise';

export class SlackNotifier {

    private readonly options: any;

    constructor(channelUri: string, hostName: string) {
        this.options = {
            json: true,
            method: 'POST',
            uri: `https://${hostName}${channelUri}`,
        };
    }

    public async notify(message: string): Promise<any> {
        this.options.body = {
            'text': message
        };

        return await request(this.options).then((body) => {
            return Promise.resolve();
        }).catch((err) => {
            console.log(err);
            return Promise.reject();
        });
    }
}
