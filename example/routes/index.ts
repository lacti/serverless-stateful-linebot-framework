import { StateRoute } from "../../src";
import { UserState } from "../models/state";
import budget from "./budget";
import greeting from "./greeting";

const routes: StateRoute<UserState> = {
  empty: { ...greeting.empty },
  budget: { ...budget.budget }
};

export default routes;
