import * as line from "@line/bot-sdk";
import * as awsTypes from "aws-lambda";
declare type CommandHandler = (id: string, command: string, replyToken: string) => Promise<void>;
export declare const installWebhook: (handler: CommandHandler) => (gatewayEvent: awsTypes.APIGatewayProxyEvent) => Promise<{
    statusCode: number;
    body: any;
}>;
export declare const reply: (replyToken: string, response: string) => Promise<line.MessageAPIResponseBase>;
export {};
