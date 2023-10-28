import { titleCase } from "../utils/titlecase";

/**
 * @typedef {Object} DDBRollData
 * @property {Object} diceNotation
 * @property {string} diceNotationStr
 * @property {Object} result
 *
 */

/**
 * @typedef {Object} DDBRoll
 * @property {DDBRollData[]} rolls
 */

/**
 *
 * @param {DDBRollData} rollData
 */
export function processDDBRoll(rollData) {
  let myRollObject = generateRollObject(
    rollData.diceNotationStr,
    rollData.result.total,
  );

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

  let r = Roll.fromData(myRollObject);

  return {
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    speaker: { alias: "D&D Beyond Dice" },
    flavor: "Hit Check Roll",
    rolls: [r],
    rollMode: game.settings.get("core", "rollMode"),
  };
}

/**
 *
 * @param {Object} ddbData
 */
export async function generateFakeRollFromDDBRoll(ddbData) {
  const rolls = [];

  for (const ddbRoll of (ddbData && ddbData.rolls) || []) {
    rolls.push(ChatMessage.create(processDDBRoll(ddbRoll), {}));
  }

  return Promise.all(rolls);
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
  ChatMessage.create(chatOptions, {});
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
