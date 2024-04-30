const Ajv = require("ajv");
const ajv = new Ajv();
const activitiesDao = require("../../dao/activities-dao.js");

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
        message: "dtoIn není platný",
        validationError: ajv.errors,
      });
      return;
    }

    const activities = activitiesDao.getById(reqParams.id);
    if (!activities || activities.length === 0) {
      res.status(404).json({
        code: "activityNotFound",
        message: `Aktivita s id ${reqParams.id} nebyla nalezena`,
      });
      return;
    }

    res.json(activities);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = GetAbl;
