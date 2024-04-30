const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const recordsController = require("./controller/records");
const receiptsController = require("./controller/receipts");
const activitiesController = require("./controller/activities");

app.use(cors());

app.use("/records", recordsController);
app.use("/receipts", receiptsController);
app.use("/activities", activitiesController);

app.use((req, res, next) => {
  res.status(404).send("404 Not Found");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
