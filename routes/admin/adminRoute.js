const express = require("express");
const router = new express.Router();

const adminController = require("../../controllers/admin/admin.controller");
const validation = require("../../validations/admin/admin.validator");
const auth = require("../../middleware/admin/auth");
const uploadImg = require('../../middleware/admin/upload');

router.post("/register", uploadImg, validation.registerValidator, adminController.register);
router.post("/login", validation.loginValidator, adminController.login);
router.post("/forgotPassword", validation.forgotPasswordValidator, adminController.forgotPassword);
router.post("/verifyOTP", validation.verifyOTPValidator, adminController.verifyOTP);
router.post("/resetPassword", validation.resetPasswordValidator, adminController.resetPassword);
router.post("/changePassword", auth.verifyToken, validation.changePasswordValidator, adminController.changePassword);

module.exports = router;
