import { CommandProcessor } from "./handler";
import { StateMap } from "./entity";
export interface ICommandRequest {
    command: string;
    replyToken: string;
}
export declare const newBasicReplier: <E, S extends StateMap<S>, T>(newProcessor: (id: string) => CommandProcessor<E, S, T>) => (id: string) => (item: ICommandRequest, timeoutMillis?: number) => Promise<boolean>;
