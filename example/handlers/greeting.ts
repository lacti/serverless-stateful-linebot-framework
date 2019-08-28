import { Handler } from "../../src";
import p from "../models/route";
import { UserState } from "../models/state";
import { IUser } from "../models/user";

export type GreetingCommand = {
  greeting: void;
};

const handlers: Handler<IUser, UserState, GreetingCommand> = {
  greeting: () => "안녕하세요!"
};

export default p.handler({
  empty: handlers
});
