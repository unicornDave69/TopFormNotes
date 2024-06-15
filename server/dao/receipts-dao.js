const fs = require("fs");
const path = require("path");

const receiptFilePath = "storage/Receipts";

function getAll() {
  try {
    const filePath = path.join(__dirname, receiptFilePath);
    const fileData = fs.readdirSync(filePath, "utf8");
    const allReceipts = [];

    fileData.forEach((groupFile) => {
      const pathToGroup = path.join(filePath, groupFile);
      const receiptData = fs.readFileSync(pathToGroup, "utf-8");
      const receipt = JSON.parse(receiptData);
      allReceipts.push(receipt);
    });

    return allReceipts;
  } catch (error) {
    throw { code: "failedToReadReceipt", message: error.message };
  }
}

module.exports = {
  getAll,
};
