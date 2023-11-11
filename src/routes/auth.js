const router = require("express").Router();
const { signIn, signOut } = require("../controllers/user-controller");

router.post("/signin", signIn);
router.get("/signout", signOut);

module.exports = router;
