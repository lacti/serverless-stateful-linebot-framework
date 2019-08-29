import { toolkit } from "../src";
import { UserState } from "./models/state";
import { IUser } from "./models/user";

const tk = toolkit<IUser, UserState>();

export default tk;
