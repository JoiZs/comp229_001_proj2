require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const api_router = require("./src/routes/api");
const auth_router = require("./src/routes/auth");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 4444;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "welcome to the dressshop application" });
});

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
})();

app.use("/api", api_router);
app.use("/auth", auth_router);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
