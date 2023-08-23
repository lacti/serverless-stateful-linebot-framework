import tk from "../toolkit";

export type GreetingCommand = {
  greeting: void;
};

const handlers = tk.handlers<GreetingCommand>({
  greeting: ({ context: { t } }) => `안녕하세요! ${t.name}`,
});

export default tk.partialStateHandlers({
  empty: handlers,
});
