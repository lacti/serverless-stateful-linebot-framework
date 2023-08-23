import { BudgetCommand } from "../handlers/budget";
import tk from "../toolkit";

const routes = tk.routes<BudgetCommand>({
  addBudget: {
    regex: /예산 추가!/,
    parse: (args) => ({
      name: args[0],
      amount: +args[1],
    }),
  },
});

export default tk.partialStateRoutes({
  budget: routes,
});
