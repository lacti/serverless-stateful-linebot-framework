import { ActorSystem } from "@yingyeothon/actor-system";
import { StateMap } from "./entity";
import { CommandProcessor } from "./handler";
export declare const getSystem: () => ActorSystem;
export interface ICommandRequest {
    command: string;
    replyToken: string;
}
export declare const newBasicReplyActor: <E, S extends StateMap<S>, T>(newProcessor: (id: string) => CommandProcessor<E, S, T>) => (id: string) => import("@yingyeothon/actor-system").Actor<ICommandRequest>;
