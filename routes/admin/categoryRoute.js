const express = require("express");
const router = new express.Router();
const categoryController = require("../../controllers/admin/category.controller");
const validation = require("../../validations/admin/category.validator");
const auth = require("../../middleware/admin/auth");

router.get("/getAll", auth.verifyToken, validation.pageValidator, categoryController.getAllcategory);
router.get("/getById/:categoryId", auth.verifyToken, categoryController.getCategoryById);
router.post("/add", auth.verifyToken, validation.categoryValidator, categoryController.addCategory);
router.post("/update/:categoryId", auth.verifyToken, validation.categoryValidator, categoryController.updateCategory);
router.delete("/delete/:categoryId", auth.verifyToken, categoryController.deleteCategory);

module.exports = router;
