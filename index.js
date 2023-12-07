require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const api_router = require("./src/routes/api");
const auth_router = require("./src/routes/auth");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const { createServer } = require("http");
const { Server: ioServer } = require("socket.io");
const {
  storeMessageController,
  createChatRoomController,
} = require("./src/controllers/conv-controller");

const app = express();
const httpServer = createServer(app);
const io = new ioServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_HOST || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});
const PORT = process.env.PORT || 4444;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_HOST || "http://localhost:5173",
  })
);

app.get("/", (req, res) => {
  res.json({ message: "welcome to the dressshop application" });
});

(async () => {
  // Connect to mongodb
  await mongoose.connect(process.env.MONGO_URI);
})();

// Two Main APIs

// Request Data from database
app.use("/api", api_router);

// Make Authentication Requests
app.use("/auth", auth_router);

io.on("connection", (sk) => {
  console.log("User connected");

  sk.on("chatroom", async (room) => {
    await createChatRoomController(room, sk);
  });

  sk.on("chat", async (msg) => {
    await storeMessageController(msg, sk);
    sk.broadcast.emit("chat", msg);
  });

  sk.on("disconnect", () => {
    console.log("User disconnected");
  });
});

httpServer.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
