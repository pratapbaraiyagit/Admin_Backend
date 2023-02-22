const express = require("express");
const app = express();
require("./config/connection");
const path = require("path");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Import Route
const adminRouter = require("./routes/admin/adminRoute");
const categoryRouter = require("./routes/admin/categoryRoute");
const subCategoryRouter = require("./routes/admin/subCategoryRoute");
// const customerFAQRouter = require("./routes/admin/customerFAQRoute");

app.use("/api/admin", adminRouter);
app.use("/api/admin/category", categoryRouter);
app.use("/api/admin/subCategory", subCategoryRouter);
// app.use("/api/admin/customerFAQ", customerFAQRouter);

app.use(express.static("./public"));
app.set('view engine', 'ejs');

app.listen(port, () => {
  console.log(`The Port is Running at ${port}`);
});
