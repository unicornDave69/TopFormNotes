const express = require("express");
const router = express.Router();
const receiptsDao = require("../dao/receipts-dao.js");

router.get("/get", (req, res) => {
  try {
    const receipts = receiptsDao.getAll(); // Nová funkce getAll pro získání všech aktivit
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
