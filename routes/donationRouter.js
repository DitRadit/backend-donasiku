const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const upload = require("../middleware/upload");

const itemController = require("../controller/itemController");
const requestController = require("../controller/requestController");
const donationController = require("../controller/donationController");


router.post("/requests", verifyToken(["receiver"]), requestController.createRequest);

router.get("/requests", verifyToken(), requestController.getAllRequests);

router.get("/requests/area", verifyToken(), requestController.getRequestsByUserArea);

router.get("/requests/:id", verifyToken(), requestController.getRequestById);

router.post("/items", verifyToken(["donor"]), upload.single("image"), itemController.createItem);

router.get("/items", verifyToken(), itemController.getAllItems);

router.get("/items/area", verifyToken(), itemController.getItemsByUserArea);

router.get("/item/by-request/:request_id", verifyToken(), itemController.getItemsByRequestId);

router.get("/items/:id", verifyToken(), itemController.getItemById);

router.get("/my-items", verifyToken(), itemController.getMyItems);

router.patch("/approve", verifyToken(), itemController.approveDonation);

router.get("/users/active", verifyToken(), donationController.getActiveDonations);

router.get("/users/:id", verifyToken(), donationController.getDonationById);

router.patch("/:id/status", verifyToken(), donationController.updateDonationStatus);

router.get("/logs", verifyToken(["admin"]), donationController.getDonationLogs);

router.get("/:donationId/logs", verifyToken(), donationController.getDonationLogsByDonationId);

module.exports = router;