const Ajv = require("ajv");
const ajv = new Ajv();
const receiptsDao = require("../../dao/receipts-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "number" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function GetAbl(req, res) {
  try {
    const reqParams = req.body;

    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const receipts = receiptsDao.getById(reqParams.id);
    if (!receipts || receipts.length === 0) {
      res.status(404).json({
        code: "receiptNotFound",
        message: `No receipt found for name ${reqParams.receiptName}`,
      });
      return;
    }

    res.json(receipts);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = GetAbl;
