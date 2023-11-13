const router = require("express").Router();
const {
  createUser,
  deleteUser,
  fetchUser,
  listUsers,
  updateUser,
} = require("../controllers/user-controller");

// 5 apis
// Create user/ Sign Up
router.post("/users", createUser);

// List all users from the database
router.get("/users", listUsers);

// GEttting one user from database using UserID
router.get("/users/:userId", fetchUser);

// Updating one user from database using UserID
router.put("/users/:userId", updateUser);

// Deleting one user from database using UserID
router.delete("/users/:userId", deleteUser);

module.exports = router;
