const fs = require("fs");
const path = require("path");

const activityFilePath = "storage/Activities";

function getById(activityId) {
  try {
    const filePath = path.join(__dirname, activityFilePath);
    const fileData = fs.readdirSync(filePath, "utf8");
    let foundActivity = null;

    fileData.forEach((groupFile) => {
      const pathToGroup = path.join(filePath, groupFile);
      const activityData = fs.readFileSync(pathToGroup, "utf-8");
      const activity = JSON.parse(activityData);
      if (activity.id === activityId) {
        foundActivity = activity;
      }
    });

    if (!foundActivity) {
      throw { code: "activityNotFound", message: "Activity not found." };
    }

    return foundActivity;
  } catch (error) {
    if (error.code === "ENOENT") {
      throw { code: "fileNotFound", message: "File not found." };
    } else {
      throw { code: "failedToReadActivity", message: error.message };
    }
  }
}

module.exports = {
  getById,
};
