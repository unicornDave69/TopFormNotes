const express = require("express");
const router = express.Router();
const activitiesDao = require("../dao/activities-dao.js");

router.get("/get", (req, res) => {
  try {
    const activities = activitiesDao.getAll();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
