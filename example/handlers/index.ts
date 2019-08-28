import { StateHandler } from "../../src";
import { UserState } from "../models/state";
import { IUser } from "../models/user";
import budget from "./budget";
import greeting from "./greeting";

const handlers: StateHandler<IUser, UserState> = {
  empty: { ...greeting.empty },
  budget: { ...budget.budget }
};

export default handlers;
