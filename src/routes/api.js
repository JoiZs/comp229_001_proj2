const router = require("express").Router();
const {
  createUser,
  deleteUser,
  fetchUser,
  listUsers,
  updateUser,
} = require("../controllers/user-controller");

router.post("/users", createUser);
router.get("/users", listUsers);
router.get("/users/:userId", fetchUser);
router.put("/users/:userId", updateUser);
router.delete("/users/:userId", deleteUser);

module.exports = router;
