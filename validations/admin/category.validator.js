const joi = require("joi");

const categoryValidator = async (req, res, next) => {
  const schema = joi.object({
    categoryName: joi.string().required(),
    description: joi.string().required(),
    isActive: joi.boolean().required()
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(403).send({ message: error.message, isSuccess: false });
  } else {
    next();
  }
};

const pageValidator = async (req, res, next) => {
  const schema = joi.object({
    pageNo: joi.number().min(1).optional(),
    perPage: joi.number().min(1).optional(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(403).send({ message: error.message, isSuccess: false });
  } else {
    next();
  }
};

module.exports = {
  categoryValidator,
  pageValidator
};