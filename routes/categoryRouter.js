// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");
const verifyToken = require("../middleware/auth");

router.post("/", verifyToken(["admin"]), categoryController.createCategories);

router.get("/", categoryController.getCategories);

router.get("/:id", categoryController.getCategoryById);

router.put("/:id", verifyToken(["admin"]), categoryController.updateCategory);

router.delete("/:id", verifyToken(["admin"]), categoryController.deleteCategory);

module.exports = router;
