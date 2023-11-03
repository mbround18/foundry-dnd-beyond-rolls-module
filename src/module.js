import { SETTINGS, initializeSettings } from "./settings/settings";
import { Connect } from "./ddbclient/ddbclient";
import { debug, logger } from "./utils/logger";
import { isDebugMode } from "./utils/constants";
import { titleCase } from "./utils/titlecase";
import packageJson from "../package.json";
import { set } from "lodash-es";

set(
  window,
  `set${titleCase(packageJson.name)}DebugMode`
    .replaceAll(" ", "")
    .replaceAll("-", ""),
  (debugMode) => {
    logger.info(`D&D Beyond Rolls Module | Setting Debug Mode to ${debugMode}`);
    localStorage.setItem(name, JSON.stringify({ debugMode }));
  },
);

/**
 * This is the entry point for the module. It is called once when Foundry VTT is ready after all data is loaded.
 */

Hooks.on("init", function () {
  logger.info("D&D Beyond Rolls Module | Initializing DDB Companion");
  logger.level = isDebugMode() ? "debug" : "info";
  debug("D&D Beyond Rolls Module | In Debug Mode");
  initializeSettings();
});

Hooks.on("ready", function () {
  logger.info("D&D Beyond Rolls Module | Ready");
  let moduleEnabled = game.settings.get(SETTINGS.MODULE_ID, SETTINGS.ENABLED);
  if (moduleEnabled) {
    logger.info("D&D Beyond Rolls Module | Connecting to DDB");
    Connect();
  }
});
