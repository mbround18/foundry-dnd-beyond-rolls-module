import { DEBUG, SETTINGS } from "../settings/settings";
import { getCobaltSocketSessionFromCobaltToken } from "../helpers/ddbhelpers";
import {
  generateFakeRoll,
  generateFakeRollFromDDBRoll,
} from "../helpers/rollhelper";

let socket = {};

export function Connect() {
  if (!DEBUG.DISABLE_DDB_CALLS) {
    getSocketAndConnect();
  } else {
    ui.notifications.info(`${SETTINGS.MODULE_NAME} - DDB Calls Disabled`);
  }
}

function getSocketAndConnect() {
  console.log("Use cobalt cookie to get cobalt socket token");
  getCobaltSocketSessionFromCobaltToken().then((result) => {
    // Don't console log the token, it is a secret.
    // console.log("RESULT " + result.token);
    connectSocket(result.token);
  });
}

function connectSocket(socketToken) {
  let game_ID = game.settings.get(SETTINGS.MODULE_ID, SETTINGS.GAME_ID);
  let player_ID = game.settings.get(SETTINGS.MODULE_ID, SETTINGS.PLAYER_ID);
  let moduleEnabled = game.settings.get(SETTINGS.MODULE_ID, SETTINGS.ENABLED);
  if (moduleEnabled) {
    ui.notifications.info(
      `${SETTINGS.MODULE_NAME} - Attempting DDB Connection`,
    );

    socket = new WebSocket(
      [
        "wss://game-log-api-live.dndbeyond.com/v1?gameId=",
        game_ID,
        "&userId=",
        player_ID + "&stt=" + socketToken,
      ].join(""),
    );

    socket.onopen = function (e) {
      console.log("DDB CONNNECTED");
      ui.notifications.info(SETTINGS.MODULE_NAME + " - Connected to DDB");

      //send heartbeat to server every 5 minutes.
      setInterval(() => {
        socket.send('{"data":"ping"}');
      }, 300000);
    };

    socket.onmessage = function (event) {
      let eventData = event && event.data && JSON.parse(event.data);
      let eventType = (event && (eventData.eventType || event.eventType)) || "";
      if (event.data !== "pong") {
        if (eventType === "dice/roll/fulfilled" && eventData) {
          generateFakeRollFromDDBRoll(eventData).then((result) =>
            console.log("[D&D Roll Companion]: Rolls Created!"),
          );
        }
      }
      // ui.notifications.info(`[message] Data received from server: ${event.data}`);
    };

    socket.onclose = function (event) {
      ui.notifications.warn(
        SETTINGS.MODULE_NAME +
          " - Connection to D&D Beyond Lost, wait 5 seconds, reconnect",
      );
      setTimeout(function () {
        getSocketAndConnect();
      }, 5000);
    };
  }
}
