import { processDDBRoll } from "../../helpers/rollhelper";

beforeAll(() => {
  global.Roll = {
    fromData: jest.fn(() => "test"),
  };

  global.game = {
    settings: {
      get: jest.fn(() => true),
    },
  };

  global.CONST = {
    CHAT_MESSAGE_TYPES: { ROLL: 5 },
  };
});

test("Test generateFakeRollFromDDBRoll", async () => {
  let content = require("../../__mocks__/example.json");
  let {
    data: { rolls: ddbRolls },
  } = content;

  expect(processDDBRoll(ddbRolls[0])).toHaveProperty("type", 5);
});
