import { http, HttpResponse } from "msw";
import { response } from "./response";

export const handlers = [
  http.post("**/v2/data.json", () => HttpResponse.json(response)),
];
