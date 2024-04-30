const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const recordsFolderPath = path.join(__dirname, "storage", "Records");

function createRecord(record) {
  try {
    record.id = crypto.randomBytes(16).toString("hex");

    const filePath = path.join(recordsFolderPath, `${record.id}.json`);

    const fileData = JSON.stringify(record);

    fs.writeFileSync(filePath, fileData, "utf8");

    return record;
  } catch (error) {
    throw { code: "failedToCreateRecord", message: error.message };
  }
}

function removeById(id) {
  try {
    const filePath = path.join(recordsFolderPath, `${id}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemoveRecord", message: error.message };
  }
}

function getAllRecords() {
  try {
    const fileData = fs.readdirSync(recordsFolderPath, "utf8");
    const records = [];

    fileData.forEach((fileName) => {
      const filePath = path.join(recordsFolderPath, fileName);
      const recordData = fs.readFileSync(filePath, "utf-8");
      const record = JSON.parse(recordData);
      records.push(record);
    });

    return records;
  } catch (error) {
    throw { code: "failedToReadRecords", message: error.message };
  }
}

module.exports = {
  getAllRecords,
  removeById,
  createRecord,
};
