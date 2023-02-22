const subCategorySchema = require("../../models/admin/subCategory.model");
const categorySchema = require("../../models/admin/category.model");

const addsubCategory = async (req, res) => {
  const categoryId = req.body.categoryId;
  await categorySchema.findById(categoryId).then(async (category) => {
    if (!category) {
      return res.status(401).send({ message: "Category not found!", isSuccess: false });
    }
    const subCategory = await subCategorySchema.findOne({ subCategoryName: req.body.subCategoryName });
    if (subCategory) {
      return res.status(401).send({
        message: "Subcategory name already exists!",
        isSuccess: false
      })
    }
    const createsubCategory = new subCategorySchema(req.body);
    createsubCategory
      .save()
      .then(() =>
        res.status(201).send({
          message: "Subcategory added successfully.",
          isSuccess: true,
        })
      )
      .catch((error) => res.status(500).send({
        error,
        message: "Something went wrong, please try again!",
        isSuccess: false
      }));
  }).catch((error) => {
    res.status(500).send({
      error,
      message: "Something went wrong, please try again!",
      isSuccess: false
    });
  });
};

const getAllsubCategory = async (req, res) => {
  const pageNo = req.body.pageNo ? req.body.pageNo : 1;
  const perPage = req.body.perPage ? req.body.perPage : 10;
  await subCategorySchema
    .find()
    .skip(perPage * pageNo - perPage)
    .limit(perPage)
    .sort({ _id: -1 })
    .populate("categoryId").then(async (data) => {
      const count = await subCategorySchema.find().count();
      res.status(200).send({
        data,
        currentPageNo: pageNo,
        totalRecords: count,
        totalPages: Math.ceil(count / perPage),
        isSuccess: true,
        message: "Subcategory lisiting successfully.",
      });
    }).catch((error) => {
      res.status(500).send({
        error,
        message: "Something went wrong, please try again!",
        isSuccess: false
      });
    })
};

const getsubCategoryById = async (req, res) => {
  const subCategoryId = req.params.subCategoryId;
  if (!subCategoryId) {
    return res.status(401).send({ message: "SubcategoryId must be required.", isSuccess: false });
  }
  await subCategorySchema.findById(subCategoryId).populate("categoryId").then((subCategory) => {
    if (!subCategory) {
      return res.status(401).send({ message: "Subcategory not found!", isSuccess: false });
    }
    return res.status(200).send({
      subCategory,
      isSuccess: true,
      message: "Subcategory get successfull."
    });
  }).catch((error) => {
    res.status(500).send({
      error,
      message: "Something went wrong, please try again!",
      isSuccess: false
    });
  });
};

const updatesubCategory = async (req, res) => {
  const subCategoryId = req.params.subCategoryId;
  if (!subCategoryId) {
    return res.status(401).send({ message: "SubcategoryId must be required.", isSuccess: false });
  }
  let category = await categorySchema.findById(req.body.categoryId);
  if (!category) {
    return res.status(401).send({
      message: "Category not found!",
      isSuccess: true
    });
  }
  const subCategoryName = await subCategorySchema.findOne({ _id: { $ne: subCategoryId }, subCategoryName: req.body.subCategoryName });
  if (subCategoryName) {
    return res.status(401).send({
      message: "Subcategory name is already existing!",
      status: false,
    });
  }
  await subCategorySchema.findByIdAndUpdate(
    subCategoryId,
    req.body,
    { new: true }
  ).then((subCategory) => {
    if (!subCategory) {
      return res.status(401).send({
        message: "Subcategory not found!",
        isSuccess: true
      });
    }
    res.status(200).send({
      message: "Subcategory Updated Successfully.",
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

const deletesubCategory = async (req, res) => {
  const subCategoryId = req.params.subCategoryId;
  if (!subCategoryId) {
    return res.status(401).send({ message: "SubcategoryId must be required.", isSuccess: false });
  }
  await subCategorySchema.findByIdAndDelete(subCategoryId).then((subCategory) => {
    if (!subCategory) {
      return res.status(401).send({ message: "Subcategory not found!", isSuccess: false });
    }
    return res.status(200).send({ message: "Subcategory deleted successfully!", isSuccess: true });
  }).catch((error) => {
    res.status(500).send({
      error,
      message: "Something went wrong, please try again!",
      isSuccess: false
    });
  });
};

module.exports = {
  addsubCategory,
  updatesubCategory,
  getsubCategoryById,
  getAllsubCategory,
  deletesubCategory,
};
