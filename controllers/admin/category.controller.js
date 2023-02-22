const categorySchema = require("../../models/admin/category.model");
const subCategorySchema = require("../../models/admin/subCategory.model");

const addCategory = async (req, res) => {
  const createCategory = new categorySchema(req.body);
  const category = await categorySchema.findOne({ categoryName: req.body.categoryName });
  if (category) {
    return res.status(401).send({
      message: "Category name already exists!",
      isSuccess: false
    })
  }
  createCategory
    .save()
    .then(() =>
      res.status(201).send({
        message: "Category added successfully.",
        isSuccess: true
      })
    )
    .catch((error) => res.status(500).send({
      error,
      message: "Something went wrong, please try again!",
      isSuccess: false
    }));
};

const getAllcategory = async (req, res) => {
  const pageNo = req.body.pageNo ? req.body.pageNo : 1;
  const perPage = req.body.perPage ? req.body.perPage : 100;
  await categorySchema
    .find()
    .skip(perPage * pageNo - perPage)
    .limit(perPage)
    .sort({ _id: -1 }).then(async (data) => {
      const count = await categorySchema.find().count();
      res.status(200).send({
        data,
        currentPageNo: pageNo,
        totalRecords: count,
        totalPages: Math.ceil(count / perPage),
        isSuccess: true,
        message: "Category listing successfully.",
      });
    }).catch((error) => {
      res.status(500).send({
        error,
        message: "Something went wrong, please try again!",
        isSuccess: false
      });
    })
};

const updateCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  if (!categoryId) {
    return res.status(401).send({ message: "CategoryId must be required.", isSuccess: false });
  }
  const categoryName = await categorySchema.findOne({ _id: { $ne: categoryId }, categoryName: req.body.categoryName });
  if (categoryName) {
    return res.status(401).send({
      message: "Category name is already existing!",
      status: false,
    });
  }
  await categorySchema.findByIdAndUpdate(
    categoryId,
    req.body,
    { new: true }
  ).then((category) => {
    if (!category) {
      return res.status(401).send({
        message: "Category not found!",
        isSuccess: true
      });
    }
    res.status(200).send({
      message: "Category Updated Successfully",
      isSuccess: true
    });
  }).catch((error) => {
    res.status(500).send({
      error,
      message: "Something went wrong, please try again!",
      isSuccess: false
    });
  })
};

const getCategoryById = async (req, res) => {
  const categoryId = req.params.categoryId;
  if (!categoryId) {
    return res.status(401).send({ message: "CategoryId must be required.", isSuccess: false });
  }
  await categorySchema.findById(categoryId).then((category) => {
    if (!category) {
      return res.status(401).send({ message: "Category not found!", isSuccess: false });
    }
    return res.status(200).send({
      category,
      isSuccess: true,
      message: "Category get successfull."
    });
  }).catch((error) => {
    res.status(500).send({
      error,
      message: "Something went wrong, please try again!",
      isSuccess: false
    });
  });
}

const deleteCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const subCategory = await subCategorySchema.findOne({ categoryId });
    if (subCategory) {
      return res.status(404).send({
        message: "Category assign to subcategory!",
        isSuccess: false
      });
    }
    await categorySchema
      .findByIdAndDelete(categoryId)
      .then((category) => {
        if (!category) return res.status(404).send({ message: "Category not found!", isSuccess: false });
        return res.status(200).send({ message: "Category deleted successfully!", isSuccess: true });
      })
      .catch((err) => {
        return res.status(500).send({
          err,
          message: "Something went wrong, please try again!",
          isSuccess: false
        });
      });
  } catch (error) {
    return res.status(500).send({
      error,
      message: "Something went wrong, please try again!",
      isSuccess: false
    });
  }
};

module.exports = {
  addCategory,
  updateCategory,
  getCategoryById,
  getAllcategory,
  deleteCategory
};
