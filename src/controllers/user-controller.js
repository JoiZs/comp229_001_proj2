const userModel = require("../models/user-model");
const argon2 = require("argon2");
const isStrongPw = require("validator/lib/isStrongPassword");
const isEmail = require("validator/lib/isEmail");
const jwt = require("jsonwebtoken");
const tk_conf = require("../config/token_config");

// Check the auth from the client
// Whether user (Login or not) by checking JWT_token
// If User --(authenticated)-->  Message(Authorized)
// Else Message(Unathorized)

const authChecker = async (req, res) => {
  const token = req.cookies["__authTk"];
  const pl = jwt.verify(token, tk_conf.jwt.secret);

  res.status(200).json({
    type: "success",
    message: pl.userId,
  });
};

// SignUp
const createUser = async (req, res) => {
  const data = req.body; //Getting datapayload from the users
  // email, password, name -> check valid or not

  if (!isEmail(data.email))
    return res.json({
      type: "error",
      message: "Invalid Email Address",
    });

  if (!isStrongPw(data.password)) {
    return res.json({
      type: "error",
      message: "Strong password is required",
    });
  }

  // Find one user -> if existed -> Send already registered
  // if not create that user
  const checkUser = await userModel.findOne(
    {
      email: data.email,
    },
    "-password"
  );

  if (!!checkUser)
    return res.json({ type: "error", message: "Account already existed" });

  // Encrypting user's password and stored in the database
  const hashPw = await argon2.hash(data.password);

  await userModel.create({
    email: data.email,
    name: data.name,
    password: hashPw,
  });

  // Send message created new user

  return res.json({
    type: "success",
    message: "Successfully created",
  });
};

const listUsers = async (req, res) => {
  // API for listing all users
  const allUsers = await userModel.find({}, "-password");

  return res.json({
    type: "success",
    message: allUsers,
  });
};

const fetchUser = async (req, res) => {
  // Each user by his Id
  const userId = req.params.userId; //Id from users' param

  // FInd user by their id on the db
  const checkUser = await userModel.findById(userId, "-password");

  // Show them (in or not in db)
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
  // Each user by his Id
  const userId = req.params.userId;
  const data = req.body;
  // from client, user must use payload{
  // name: string;
  // email: string;
  // updated: Date;}

  // find and update by userid
  await userModel
    .findByIdAndUpdate(userId, {
      // If User, update the user's information in db
      $set: {
        email: data.email,
        name: data.name,
        updated: new Date(Date.now()),
      },
    })
    .catch(() => {
      // User not found, send message no user found.
      return res.json({
        type: "error",
        message: "Found no user.",
      });
    });

  // after updating in db, send message as follow
  return res.json({
    type: "success",
    message: "Updated a user.",
  });
};

const deleteUser = async (req, res) => {
  const userId = req.params.userId;

  // Delete by userid
  await userModel.findOneAndDelete(userId).catch(() => {
    // no user found >> following message
    return res.json({
      type: "error",
      message: "Found no user.",
    });
  });

  // after delete >> following message
  return res.json({
    type: "success",
    message: "Deleted a user.",
  });
};

const signIn = async (req, res) => {
  const data = req.body;

  // {email, password} => data (from users' side)

  // check 2 -> Invalid email, Strong password
  if (!data.email && !data.password) {
    return res.json({
      type: "error",
      message: "Invalid inputs.",
    });
  }

  if (!isEmail(data.email))
    return res.json({
      type: "error",
      message: "Invalid Email Address",
    });

  if (!isStrongPw(data.password)) {
    return res.json({
      type: "error",
      message: "Strong password is required",
    });
  }

  // check user's registerd or not by looking their user in db
  const checkUser = await userModel.findOne({ email: data.email });

  if (!checkUser)
    //  No user found, send msg to register
    return res.json({
      type: "error",
      message: "Create an account first to log in.",
    });

  // Check user' plain password, and db's encrypted pw
  if (!(await argon2.verify(checkUser.password, data.password)))
    return res.json({
      type: "error",
      message: "Incorrect password",
    });

  // After everyhing is correct, assign token for that user
  const token = jwt.sign(
    { userId: checkUser.id },
    tk_conf.jwt.secret,
    tk_conf.jwt.options
  );

  // After assiging tk, send token as a cookie to the client
  // Client will store that cookie in their side
  res.cookie("__authTk", token, {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
  });

  // Send Success msg
  return res.json({
    type: "success",
    message: "Successfully login",
  });
};
const signOut = async (req, res) => {
  //  delete token from client... => Delete token on clients' side
  res.clearCookie("__authTk");
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
