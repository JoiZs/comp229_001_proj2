const userModel = require("../models/user-model");
const argon2 = require("argon2");
const isStrongPw = require("validator/lib/isStrongPassword");
const isEmail = require("validator/lib/isEmail");
const jwt = require("jsonwebtoken");
const tk_conf = require("../config/token_config");

const authChecker = async (req, res) => {
  res.status(200).json({
    type: "success",
    message: "Authorized",
  });
};

const createUser = async (req, res) => {
  const data = req.body;

  if (!isEmail(data.email))
    return res.json({
      type: "error",
      message: "Invalid Email Address",
    });

  if (!isStrongPw) {
    return res.json({
      type: "error",
      message: "Strong password is required",
    });
  }

  const checkUser = await userModel.findOne(
    {
      $or: [{ email: data.email }, { name: data.name }],
    },
    "-password"
  );

  if (!!checkUser)
    return res.json({ type: "error", message: "Account already existed" });

  const hashPw = await argon2.hash(data.password);

  await userModel.create({
    email: data.email,
    name: data.name,
    password: hashPw,
  });

  return res.json({
    type: "success",
    message: "Successfully created",
  });
};

const listUsers = async (req, res) => {
  const allUsers = await userModel.find();

  return res.json({
    type: "success",
    message: allUsers,
  });
};

const fetchUser = async (req, res) => {
  const userId = req.params.userId;

  const checkUser = await userModel.findById(userId, "-password");

  if (!checkUser)
    return res.json({
      type: "error",
      message: "Found no user.",
    });

  return res.json({
    type: "success",
    message: checkUser,
  });
};

const updateUser = async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  // from client, user must use payload{
  // name: string;
  // email: string;
  // updated: Date;}

  await userModel
    .findByIdAndUpdate(userId, {
      $set: {
        email: data.email,
        name: data.name,
        updated: new Date(Date.now()),
      },
    })
    .catch(() => {
      return res.json({
        type: "error",
        message: "Found no user.",
      });
    });

  return res.json({
    type: "success",
    message: "Updated a user.",
  });
};

const deleteUser = async (req, res) => {
  const userId = req.params.userId;

  await userModel.findOneAndDelete(userId).catch(() => {
    return res.json({
      type: "error",
      message: "Found no user.",
    });
  });

  return res.json({
    type: "success",
    message: "Deleted a user.",
  });
};

const signIn = async (req, res) => {
  const data = req.body;

  if (!isEmail(data.email))
    return res.json({
      type: "error",
      message: "Invalid Email Address",
    });

  if (!isStrongPw) {
    return res.json({
      type: "error",
      message: "Strong password is required",
    });
  }

  const checkUser = await userModel.findOne({ email: data.email });

  if (!checkUser)
    return res.json({
      type: "error",
      message: "Create an account first to log in.",
    });

  if (!(await argon2.verify(checkUser.password, data.password)))
    return res.json({
      type: "error",
      message: "Incorrect password",
    });

  const token = jwt.sign(
    { userId: checkUser.id },
    tk_conf.jwt.secret,
    tk_conf.jwt.options
  );

  res.cookie("__authTk", token);

  return res.json({
    type: "success",
    message: "Successfully login",
  });
};
const signOut = async (req, res) => {
  //  delete token from client...

  return res.json({
    type: "success",
    message: "Successfully logout",
  });
};

module.exports = {
  createUser,
  listUsers,
  fetchUser,
  updateUser,
  deleteUser,
  signIn,
  signOut,
  authChecker,
};
