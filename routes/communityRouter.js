const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const communityController = require("../controller/communityController");

router.post("/register", verifyToken(), communityController.registerCommunity);

router.get("/my-communities", verifyToken(), communityController.getMyCommunities);

router.patch("/:id/members", verifyToken(), communityController.updateMembersCount);

module.exports = router;
