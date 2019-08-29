import { installWebhook } from "../src";
import handlers from "./handlers";
import routes from "./routes";
import tk from "./toolkit";

const getBasicActor = tk.newActorGetter({
  routeHandlers: tk.routeHandlers(routes, handlers),
  initialEntity: () => ({ name: "unknown" }),
  initialState: () => ({ name: "empty", payload: undefined })
});

export const webhook = installWebhook(async (id, command, replyToken) => {
  await getBasicActor(id).send(
    {
      command,
      replyToken
    },
    {
      // I think it would not be touched.
      shiftTimeout: 30 * 1000
    }
  );
});
