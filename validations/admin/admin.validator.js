const joi = require("joi");

const registerValidator = async (req, res, next) => {
  const schema = joi.object({
    fullName: joi.string().min(3).required(),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).required(),
    password: joi.string().min(6).required(),
    phoneNumber: joi.string().regex(/^[0-9]{10}$/).messages({ "string.pattern.base": `Phone number must have 10 digits.` }).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(403).send({ message: error.message, isSuccess: false });
  } else {
    next();
  }
};

const loginValidator = async (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).required(),
    password: joi.string().min(6).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(403).send({ message: error.message, isSuccess: false });
  } else {
    next();
  }
};

const forgotPasswordValidator = async (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(403).send({ message: error.message, isSuccess: false });
  } else {
    next();
  }
}

const verifyOTPValidator = async (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).required(),
    otpCode: joi.number().required()
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(403).send({ message: error.message, isSuccess: false });
  } else {
    next();
  }
}

const resetPasswordValidator = async (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).required(),
    newPassword: joi.string().min(6).required(),
    confirmPassword: joi.string().min(6).required()
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(403).send({ message: error.message, isSuccess: false });
  } else {
    next();
  }
}

const changePasswordValidator = async (req, res, next) => {
  const schema = joi.object({
    oldPassword: joi.string().min(6).required(),
    newPassword: joi.string().min(6).required(),
    confirmPassword: joi.string().min(6).required()
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(403).send({ message: error.message, isSuccess: false });
  } else {
    next();
  }
}
module.exports = {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  verifyOTPValidator,
  resetPasswordValidator,
  changePasswordValidator
};
