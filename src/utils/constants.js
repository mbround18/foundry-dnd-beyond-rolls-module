/**
 * @type {Object}
 * @property {string} name
 */
export const { name } = require("../../package.json");

/**
 *
 * @type {Object}
 * @property {boolean} debugMode
 */
export const localStorageInfo = JSON.parse(localStorage.getItem(name) || "{}");

/**
 *
 * @type {boolean}
 */
export const debugMode =
  (localStorageInfo && localStorageInfo.debugMode) || false;

/**
 * @returns {boolean}
 */
export function isDebugMode() {
  const localStorageInfo = JSON.parse(localStorage.getItem(name) || "{}");
  return (localStorageInfo && localStorageInfo.debugMode) || false;
}
