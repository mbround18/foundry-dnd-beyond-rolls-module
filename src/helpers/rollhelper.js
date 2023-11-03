import { debug, logger } from "../utils/logger";
import { get } from "lodash-es";
import { titleCase } from "../utils/titlecase";

/**
 * @typedef {Object} DDBRollData
 * @property {Object} diceNotation
 * @property {string} diceNotationStr
 * @property {Object} result
 * @property {Object} rollType
 *
 */

/**
 * @typedef {Object} DDBRoll
 * @property {DDBRollData[]} rolls
 */

/**
 * @param {object} options
 * @param {string} options.name
 * @param {string} options.action
 * @param {DDBRollData} options.rollData
 */
export function processDDBRoll(options) {
  const { name, action, rollData } = options;
  let flavor = action || "Roll";

  if (flavor.toLowerCase().trim() !== "roll" || rollData.rollType !== "Roll") {
    flavor = titleCase(`${flavor} - ${rollData.rollType} Roll`);
  }

  let myRollObject = generateRollObject(
    rollData.diceNotationStr,
    rollData.result.total,
  );

  debug("D&D Beyond Rolls Module | Roll Data", myRollObject);
  rollData.diceNotation.set.forEach(
    (
      /**
       * @param {Object} set
       * @param {Object} set.dice
       */
      set,
    ) => {
      set.dice.forEach(
        (
          /**
           * @param {Object} die
           * @param {string} die.dieType
           * @param {string} die.dieValue
           */
          die,
        ) => {
          myRollObject.terms.push(
            generateRollTerm(
              Number(die.dieType.slice(1)),
              Number(die.dieValue),
            ),
          );
        },
      );
    },
  );
  debug("D&D Beyond Rolls Module | Roll Data", myRollObject);
  let r = Roll.fromData(myRollObject);
  debug("D&D Beyond Rolls Module | Roll Object", r);

  return {
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    speaker: { alias: name },
    flavor,
    rolls: [r],
    rollMode: game.settings.get("core", "rollMode"),
  };
}

/**
 *
 * @param {Object} ddbData
 */
export async function generateFakeRollFromDDBRoll(ddbData) {
  debug("D&D Beyond Rolls Module | DDB Data", ddbData);
  const action = get(ddbData, "data.action", "Roll");
  const name = get(ddbData, "data.context.name", "D&D Beyond Dice");
  const rolls = get(ddbData, "data.rolls", {});
  return Promise.all(
    rolls.map((rollData) =>
      ChatMessage.create(processDDBRoll({ name, action, rollData }), {}),
    ),
  );
}

export async function generateFakeRoll() {
  let myRollObject = generateRollObject("My Roll Object", 15);
  myRollObject.terms.push(generateRollTerm(20, 5));
  myRollObject.terms.push(generateRollTerm(20, 5));
  myRollObject.terms.push(generateRollTerm(20, 5));

  let r = Roll.fromData(myRollObject);

  let chatOptions = {
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    speaker: { alias: "D&D Beyond Dice" },
    flavor: "Hit Check Roll",
    rolls: [r],
    rollMode: game.settings.get("core", "rollMode"),
  };
  return ChatMessage.create(chatOptions, {});
}

function generateRollObject(formula, total) {
  return {
    class: "Roll",
    options: {},
    dice: [],
    formula: formula,
    terms: [],
    total: total,
  };
}

function generateRollTerm(faces, result) {
  return {
    class: "Die",
    options: {},
    number: 1,
    faces: faces,
    modifiers: [],
    results: [
      {
        result: result,
        active: true,
      },
    ],
  };
}
