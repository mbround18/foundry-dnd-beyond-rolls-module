import { SETTINGS, initializeSettings } from "./settings/settings";
import { Connect } from "./ddbclient/ddbclient";

/**
 * This is the entry point for the module. It is called once when Foundry VTT is ready after all data is loaded.
 */

Hooks.on("init", function () {
  initializeSettings();
});

Hooks.on("ready", function () {
  let moduleEnabled = game.settings.get(SETTINGS.MODULE_ID, SETTINGS.ENABLED);
  if (moduleEnabled) {
    Connect();
  }
});
