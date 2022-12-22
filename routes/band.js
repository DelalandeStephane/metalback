const express = require("express");
const router = express.Router();
const bandsCtrl = require("../controllers/band");

router.get("/get-all-bands",bandsCtrl.getBands);
router.get("/get-band/:id",bandsCtrl.getBand);
router.get("/get-search-bands/:search",bandsCtrl.searchBands);
router.post("/get-filter-bands",bandsCtrl.filterBands);

module.exports = router;