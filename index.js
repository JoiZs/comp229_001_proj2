const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const api_router = require("./src/routes/api");
const auth_router = require("./src/routes/auth");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 4444;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "welcome to the dressshop application" });
});

app.use("/api", api_router);
app.use("/auth", auth_router);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

const jwt = require("jsonwebtoken");
const config = require("./config");
const auth = require("./auth");


//login
app.post("/login", (req, res) => {
  const payload = {
    username: req.body.username,
    email: req.body.email,
  };

  const token = jwt.sign(payload, config.jwt.secret, config.jwt.options);

  const body = {
    username: req.body.username,
    email: req.body.email,
    token: token,
  };

  res.status(200).json(body);
});

//approve
app.get("/test", auth, (req, res) => {
  res.status(200).json({
    msg: "It is approved",
  });
});