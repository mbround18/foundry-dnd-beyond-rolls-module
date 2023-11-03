import { isDebugMode } from "./constants";

export const logger = console;

export function debug(...args) {
  if (isDebugMode()) {
    logger.debug(...args);
  }
}
