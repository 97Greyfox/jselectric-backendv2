const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const jobNumber = require("../controllers/jobNumber.js");
router.get("/", jobNumber.getJobNumber);
router.post("/addJobNumber", jobNumber.addJobNumber);
router.patch("/:jobNumberId", jobNumber.editJobNumber);
router.delete("/:jobNumberId", jobNumber.deleteJobNumber);
module.exports = router;
