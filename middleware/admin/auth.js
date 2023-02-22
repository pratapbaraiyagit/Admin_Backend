const jwt = require("jsonwebtoken");
const adminSchema = require("../../models/admin/admin.model");

const verifyToken = async (req, res, next) => {
  const token = req.body.token || req.query.token || req.header["x-access-token"] || req.header("Authorization");
  if (!token) {
    return res.status(401).send({
      message: "Token is required.",
      isSuccess: false
    });
  }
  const bearerToken = token.split(" ")[1];
  try {
    jwt.verify(bearerToken, process.env.ADMIN_TOKEN_KEY, async (err, authData) => {
      if (err) {
        return res.status(500).send({
          err,
          message: "Invalid Token!",
          isSuccess: false
        });
      }
      let admin = await adminSchema.findOne({ _id: authData.admin_id });
      req.admin = admin;
      next();
    });
  } catch (error) {
    res.status(500).send({
      error,
      message: "Something went wrong, please try again!",
      isSuccess: false
    });
  }
};

module.exports = { verifyToken };