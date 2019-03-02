export interface IEmailData {
    orderId: string;
    subject: string;
    getBody(): string;
}

export class BusinessEmailData implements IEmailData {
    orderId: string;
    subject: string;

    constructor(orderId: string, subject: string) {
        this.orderId = orderId;
        this.subject = subject;
    }

    getBody() {
        return `Thank you for your order! You order reference number is ${this.orderId}`;
    }
}
