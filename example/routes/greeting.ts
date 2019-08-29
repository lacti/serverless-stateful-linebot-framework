import { GreetingCommand } from "../handlers/greeting";
import tk from "../toolkit";

const routes = tk.routes<GreetingCommand>({
  greeting: {
    regex: /안녕/,
    parse: () => undefined
  }
});

export default tk.partialStateRoutes({
  empty: routes
});
