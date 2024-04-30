const express = require("express");
const router = express.Router();
const GetAbl = require("../abl/activities/getAbl");

router.post("/get", (req, res) => {
  GetAbl(req, res);
});

module.exports = router;
