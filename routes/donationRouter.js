const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const upload = require("../middleware/upload");

const itemController = require("../controller/itemController");
const requestController = require("../controller/requestController");
const donationController = require("../controller/donationController");


router.post("/requests", verifyToken(["receiver"]), requestController.createRequest);

router.get("/requests", verifyToken(), requestController.getAllRequests);

router.get("/requests/:id", verifyToken(), requestController.getRequestById);

router.post("/items", verifyToken(["donor"]), upload.single("image"), itemController.createItem);

router.get("/requests/:id/items", verifyToken(["receiver"]), itemController.getRequestItems);

router.get("/items/:id", verifyToken(), itemController.getItemById);

router.get("/my-items", verifyToken(), itemController.getMyItems);

router.patch("/items/:id/status", verifyToken(["receiver"]), itemController.updateItemStatusReceiver);

router.get("/users/active", verifyToken(), donationController.getActiveDonations);

router.get("/users/:id", verifyToken(), donationController.getDonationById);

router.patch("/:id/status", verifyToken(), donationController.updateDonationStatus);

module.exports = router;