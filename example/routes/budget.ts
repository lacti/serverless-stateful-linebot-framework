import { Route } from "../../src";
import { BudgetCommand } from "../handlers/budget";
import p from "../models/route";

const routes: Route<BudgetCommand> = {
  addBudget: {
    regex: /예산 추가!/,
    parse: args => ({
      name: args[0],
      amount: +args[1]
    })
  }
};

export default p.route({
  budget: routes
});
