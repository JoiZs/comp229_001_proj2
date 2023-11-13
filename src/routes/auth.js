const router = require("express").Router();
const {
  signIn,
  signOut,
  authChecker,
  createUser,
} = require("../controllers/user-controller");
const checkAuth = require("../middleware/checkTk");

router.post("/signin", signIn);
router.post("/signup", createUser);
router.get("/signout", signOut);
router.get("/test", checkAuth, authChecker);

module.exports = router;
