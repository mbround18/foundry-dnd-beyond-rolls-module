import { debugMode } from "./constants";

export const logger = require("pino")({
  name: "ddb-logger",
  level: "debug",
});
