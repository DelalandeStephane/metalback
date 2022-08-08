const express = require("express");
const router = express.Router();
const bandsCtrl = require("../controllers/band");

router.get("/get-all-bands",bandsCtrl.getBands);

module.exports = router;