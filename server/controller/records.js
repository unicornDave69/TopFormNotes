const express = require("express");
const router = express.Router();

const getAbl = require("../abl/records/getAbl.js");
const deleteAbl = require("../abl/records/deleteAbl.js");
const createAbl = require("../abl/records/createAbl.js");

router.get("/get", (req, res) => {
  getAbl(req, res);
});

router.post("/delete", (req, res) => {
  deleteAbl(req, res);
});

router.post("/create", (req, res) => {
  createAbl(req, res);
});

module.exports = router;
