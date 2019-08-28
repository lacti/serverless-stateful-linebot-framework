import { Route } from "../../src";
import { GreetingCommand } from "../handlers/greeting";
import p from "../models/route";

const routes: Route<GreetingCommand> = {
  greeting: {
    regex: /안녕/,
    parse: () => undefined
  }
};

export default p.route({
  empty: routes
});
