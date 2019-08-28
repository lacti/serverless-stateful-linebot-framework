import { Handler } from "../../src";
import p from "../models/route";
import { UserState } from "../models/state";
import { IUser } from "../models/user";

export type BudgetCommand = {
  addBudget: {
    name: string;
    amount: number;
  };
};

const handlers: Handler<IUser, UserState, BudgetCommand> = {
  addBudget: ({ context, name, amount }) => {
    const userName = context.entity.name;
    return `${userName}, 이름[${name}]으로 ${amount}를 추가했습니다.`;
  }
};

export default p.handler({
  budget: handlers
});
