const joi = require("joi");

const subCategoryValidator = async (req, res, next) => {
    const schema = joi.object({
        categoryId: joi.string().required().trim().min(24).max(24),
        subCategoryName: joi.string().required(),
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

module.exports = {
    subCategoryValidator
};