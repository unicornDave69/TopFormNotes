const fs = require("fs");
const path = require("path");

const receiptFilePath = "storage/Receipts";

function getById(receiptId) {
  try {
    const filePath = path.join(__dirname, receiptFilePath);
    const fileData = fs.readdirSync(filePath, "utf8");
    let foundReceipt = null;

    fileData.forEach((groupFile) => {
      const pathToReceipt = path.join(filePath, groupFile);
      const receiptData = fs.readFileSync(pathToReceipt, "utf-8");
      const receipt = JSON.parse(receiptData);
      if (receipt.id === receiptId) {
        foundReceipt = receipt;
      }
    });

    if (!foundReceipt) {
      throw { code: "receiptNotFound", message: "Receipt not found." };
    }

    return foundReceipt;
  } catch (error) {
    if (error.code === "ENOENT") {
      throw { code: "fileNotFound", message: "File not found." };
    } else {
      throw { code: "failedToReadReceipt", message: error.message };
    }
  }
}
module.exports = {
  getById,
};
