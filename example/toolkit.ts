import { User } from "./models/user";
import { UserState } from "./models/state";
import { toolkit } from "../src";

const tk = toolkit<User, UserState>();

export default tk;
