const express = require("express");
const router = express.Router();
const areaController = require("../controller/areaController");
const verifyToken = require("../middleware/auth");

router.post("/seed", verifyToken("admin"), areaController.seedProvinces);

router.get("/areas", verifyToken(), areaController.getAreas);

module.exports = router;
