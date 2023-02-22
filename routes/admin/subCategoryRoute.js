const express = require("express");
const router = new express.Router();
const subCategoryController = require("../../controllers/admin/subCategory.controller");
const validation = require("../../validations/admin/subCategory.validator");
const pageValidation = require("../../validations/admin/category.validator");
const auth = require("../../middleware/admin/auth");

router.get("/getAll", auth.verifyToken, pageValidation.pageValidator, subCategoryController.getAllsubCategory);
router.get("/getById/:subCategoryId", auth.verifyToken, subCategoryController.getsubCategoryById);
router.post("/add", auth.verifyToken, validation.subCategoryValidator, subCategoryController.addsubCategory);
router.post("/update/:subCategoryId", auth.verifyToken, validation.subCategoryValidator, subCategoryController.updatesubCategory);
router.delete("/delete/:subCategoryId", auth.verifyToken, subCategoryController.deletesubCategory);

module.exports = router;