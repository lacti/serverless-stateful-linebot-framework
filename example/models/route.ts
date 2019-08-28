import { partial } from "../../src";
import { UserState } from "./state";
import { IUser } from "./user";

const p = partial<IUser, UserState>();

export default p;
