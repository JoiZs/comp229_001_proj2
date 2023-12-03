const router = require("express").Router();
const { getAllMsgController } = require("../controllers/conv-controller");
const {
  createUser,
  deleteUser,
  fetchUser,
  listUsers,
  updateUser,
} = require("../controllers/user-controller");
const checkAuth = require("../middleware/checkTk");

// 5 apis
// Create user/ Sign Up
router.post("/users", createUser);

// List all users from the database
router.get("/users", listUsers);

// GEttting one user from database using UserID
router.get("/users/:userId", checkAuth, fetchUser);
router.post("/msg", getAllMsgController);

// Updating one user from database using UserID
router.put("/users/:userId", checkAuth, updateUser);

// Deleting one user from database using UserID
router.delete("/users/:userId", checkAuth, deleteUser);

module.exports = router;
