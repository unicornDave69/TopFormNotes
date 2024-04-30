const recordsDao = require("../../dao/records-dao.js");

async function GetAbl(req, res) {
  try {
    const records = recordsDao.getAllRecords();
    res.json(records);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = GetAbl;
