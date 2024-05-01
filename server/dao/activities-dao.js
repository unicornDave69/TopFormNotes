const fs = require("fs");
const path = require("path");

const activityFilePath = "storage/Activities";

// Nová funkce pro získání všech aktivit
function getAll() {
  try {
    const filePath = path.join(__dirname, activityFilePath);
    const fileData = fs.readdirSync(filePath, "utf8");
    const allActivities = [];

    fileData.forEach((groupFile) => {
      const pathToGroup = path.join(filePath, groupFile);
      const activityData = fs.readFileSync(pathToGroup, "utf-8");
      const activity = JSON.parse(activityData);
      allActivities.push(activity);
    });

    return allActivities;
  } catch (error) {
    throw { code: "failedToReadActivities", message: error.message };
  }
}

module.exports = {
  getAll,
};
