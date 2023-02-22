const adminSchema = require("../../models/admin/admin.model");
const bcrypt = require("bcrypt");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../../helpers/mail");
const ejs = require('ejs');
const path = require("path");

const register = async (req, res) => {
  try {
    const { email, fullName, password, phoneNumber } = req.body;
    if (req.file != undefined && req.file.size > 100000) {
      fs.unlink(req.file.path, function (err) {
        if (err) return console.log(err);
        console.log('file deleted successfully');
      });
      return res.status(401).send({
        message: "Pleaswe upload less then 10mb file.",
        isSuccess: false,
      });
    }
    if (req.file != undefined && !req.file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      fs.unlink(req.file.path, function (err) {
        if (err) return console.log(err);
        console.log('file deleted successfully');
      });
      return res.status(401).send({
        message: "Please upload a image.",
        isSuccess: false,
      });
    }
    const emailCheck = await adminSchema.find({ email });
    if (emailCheck.length > 0) {
      if (req.file) {
        fs.unlink(req.file.path, function (err) {
          if (err) return console.log(err);
          console.log('file deleted successfully');
        });
      }
      res.status(401).send({
        message: "Email is Already Register.",
        isSuccess: false,
      });
    } else {
      const newAdmin = new adminSchema({
        fullName,
        email,
        password,
        phoneNumber,
        profileImage: (req.file == undefined) ? null : "public/admin/profile/" + req.file.filename,
      });
      const salt = await bcrypt.genSalt(10);
      newAdmin.password = await bcrypt.hash(newAdmin.password, salt);
      newAdmin
        .save()
        .then(() =>
          res.status(201).send({ message: "Register Successfully.", isSuccess: true })
        )
        .catch((error) => res.send({ message: error, isSuccess: false }));
    }
  } catch (error) {
    res.status(500).send({
      error,
      message: "Something went wrong, please try again!",
      isSuccess: false
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const findAdmin = await adminSchema.findOne({ email });
  try {
    if (!findAdmin) {
      return res.status(401).send({
        message: "Email not found!",
        isSuccess: false
      });
    }
    const isMatch = await bcrypt.compare(password, findAdmin.password);
    const generateAuthToken = jwt.sign(
      { admin_id: findAdmin._id, email },
      process.env.ADMIN_TOKEN_KEY,
      {
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      }
    );
    if (isMatch) {
      res.status(200).send({
        data: {
          authToken: generateAuthToken,
          message: "Login Success"
        },
        isSuccess: true,
      });
    } else {
      res.status(401).send({ message: "Invalid Password.", isSuccess: false });
    }
  } catch (error) {
    res.status(500).send({
      error,
      message: "Something went wrong, please try again!",
      isSuccess: false
    });
  }
};

const forgotPassword = async (req, res) => {
  const email = req.body.email;
  const findAdmin = await adminSchema.findOne({ email });
  try {
    if (findAdmin) {
      let otpCode = Math.floor(100000 + Math.random() * 900000);

      const mailBody = await ejs.renderFile(
        path.join(__dirname, "../../views/admin/mailTemplate.ejs"),
        { otpCode: otpCode, fullName: findAdmin.fullName }
      );
      let emailResponse = await sendMail(email, 'Admin Reset Password.', mailBody);
      if (!emailResponse) {
        return res.status(500).send({
          message: "Error in sending otp",
          isSuccess: false
        });
      }

      let otpExpireIn = Date.now() + Number(process.env.OTP_VALID_TIME);
      await adminSchema
        .findByIdAndUpdate(
          { _id: findAdmin._id },
          { otpCode: otpCode, otpExpireIn: otpExpireIn },
          { new: true }
        )
        .then(() => {
          return res.status(200).send({
            email: email,
            message: `OTP is sent to your email.`,
            isSuccess: true
          });
        })
        .catch((error) => {
          return res.status(500).send({
            error,
            message: "Something went wrong, please try again!",
            isSuccess: false
          });
        });
    } else {
      res.status(401).send({
        message: "Email not found.",
        isSuccess: false,
      });
    }
  } catch (error) {
    res.status(500).send({
      error,
      message: "Something went wrong, please try again!",
      isSuccess: false
    });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otpCode } = req.body;
  try {
    await adminSchema
      .findOne({ email })
      .then((admin) => {
        if (admin) {
          if (otpCode == admin.otpCode) {
            let checkOTPExpire = Date.now() > admin.otpExpireIn;
            checkOTPExpire
              ? res.status(401).send({
                message: "OTP Expired.",
                isSuccess: false
              })
              : res.status(200).send({
                message: "OTP verify successfully.",
                isSuccess: true,
              });
          } else {
            res.status(401).send({
              message: "Invalid OTP.",
              isSuccess: false
            });
          }
        } else {
          res.status(401).send({
            message: "Email not found.",
            isSuccess: false
          });
        }
      })
      .catch((error) => {
        res.status(500).send({
          error,
          message: "Something went wrong, please try again!",
          isSuccess: false
        });
      });
  } catch (error) {
    res.status(500).send({
      error,
      message: "Something went wrong, please try again!",
      isSuccess: false
    });
  }
};

const resetPassword = async (req, res) => {
  let { email, newPassword, confirmPassword } = req.body;
  const findAdmin = await adminSchema.findOne({ email });
  if (!findAdmin) {
    return res.status(401).send({
      message: "Email not exists.",
      isSuccess: false
    });
  }
  try {
    if (newPassword == confirmPassword) {
      const salt = await bcrypt.genSalt(10);
      newPassword = await bcrypt.hash(newPassword, salt);
      await adminSchema
        .findByIdAndUpdate(
          { _id: findAdmin._id },
          { password: newPassword },
          { new: true }
        )
        .then(() => {
          return res.status(200).send({
            message: `Password reset successfully.`,
            isSuccess: true
          });
        })
        .catch((error) => {
          res.status(500).send({
            error,
            message: "Something went wrong, please try again!",
            isSuccess: false
          });
        });
    } else {
      res.status(401).send({
        message: "New password and Confirm password does not match.",
        isSuccess: false,
      });
    }
  } catch (error) {
    res.status(500).send({
      error,
      message: "Something went wrong, please try again!",
      isSuccess: false
    });
  }
};

const changePassword = async (req, res) => {
  let { oldPassword, newPassword, confirmPassword } = req.body;
  const findAdmin = await adminSchema.findOne({ email: req.admin.email });
  if (!findAdmin) {
    return res.status(401).send({
      message: "Email not exists.",
      isSuccess: false
    });
  }
  try {
    const checkPassword = await bcrypt.compare(oldPassword, findAdmin.password);
    if (oldPassword == newPassword) {
      return res.status(401).send({
        message: "Old password and newpassword must be not same.",
        isSuccess: false
      });
    }
    if (checkPassword) {
      if (newPassword == confirmPassword) {
        const salt = await bcrypt.genSalt(10);
        newPassword = await bcrypt.hash(newPassword, salt);
        await adminSchema
          .findByIdAndUpdate(
            { _id: findAdmin._id },
            { password: newPassword },
            { new: true }
          )
          .then(() => {
            return res.status(200).send({
              message: `Your password successfully changed.`,
              isSuccess: true
            });
          })
          .catch((error) => {
            res.status(500).send({
              error,
              message: "Something went wrong, please try again!",
              isSuccess: false
            });
          });
      } else {
        res.status(401).send({
          message: "New password and Confirm password does not match.",
          isSuccess: false,
        });
      }
    } else {
      res.status(401).send({
        message: "Old password incorrect.",
        isSuccess: false,
      });
    }
  } catch (error) {
    res.status(500).send({
      error,
      message: "Something went wrong, please try again!",
      isSuccess: false
    });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  changePassword
};
