import { PrismaClient as UserDataClient } from "../../../prisma/generated/userDataClient/index.js";

export const userDataClient = new UserDataClient({
  log: ["query", "info", "warn", "error"],
  errorFormat: "pretty",
});
