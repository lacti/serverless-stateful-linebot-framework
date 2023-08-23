import tk from "../toolkit";

export type BudgetCommand = {
  addBudget: {
    name: string;
    amount: number;
  };
};

const handlers = tk.handlers<BudgetCommand>({
  addBudget: ({ context, name, amount }) => {
    const userName = context.entity.name;
    return `${userName}, 이름[${name}]으로 ${amount}를 추가했습니다.`;
  },
});

export default tk.partialStateHandlers({
  budget: handlers,
});
