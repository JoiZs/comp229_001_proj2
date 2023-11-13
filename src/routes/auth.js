const router = require("express").Router();
const {
  signIn,
  signOut,
  authChecker,
  createUser,
} = require("../controllers/user-controller");
const checkAuth = require("../middleware/checkTk");

// loginin api
router.post("/signin", signIn);

// for creating new user
router.post("/signup", createUser);

// for log out
router.get("/signout", signOut);

// checkAuth -> Middleware for checking users' token
// authChecker -> Sending message to user where authenticated or not
router.get("/test", checkAuth, authChecker);

module.exports = router;
