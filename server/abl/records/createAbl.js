const Ajv = require("ajv");
const ajv = new Ajv();
const { createRecord } = require("../../dao/records-dao.js");

const schema = {
  type: "object",
  properties: {
    date: { type: "string" },
    setCalorieBudget: { type: "integer" },
    consumedCalories: { type: "integer" },
    burnedCalories: { type: "integer" },
    result: { type: "integer" },
  },
  required: [
    "date",
    "setCalorieBudget",
    "consumedCalories",
    "burnedCalories",
    "result",
  ],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let record = req.body;

    const valid = ajv.validate(schema, record);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    record = createRecord(record);

    res.json(record);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;
