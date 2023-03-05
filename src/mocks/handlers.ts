import { rest } from "msw";
import { response } from "./response";

export const handlers = [
  rest.post("**/v2/data.json", (_req, res, ctx) => res(ctx.json(response))),
];
