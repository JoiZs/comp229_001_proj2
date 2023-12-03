const { ConverseModel, MessageModel } = require("../models/conv-model");
const {
  Types: { ObjectId },
} = require("mongoose");
const userModel = require("../models/user-model");

const createChatRoomController = async (room, sk) => {
  let isValidId = false;

  room.participants.forEach((p) => {
    if (ObjectId.isValid(p)) isValidId = true;
  });

  if (isValidId)
    await ConverseModel.findOne({
      participants: room.participants,
    })
      .then(async (res) => {
        if (!res) {
          const createRoom = await ConverseModel.create({
            participants: room.participants,
          });

          sk.emit("chatroom", createRoom);
        }
        sk.emit("chatroom", res);
      })
      .catch((err) => console.log(err));
};

const storeMessageController = async (msg, sk) => {
  const user = await userModel.findById(msg.senderId);
  const room = await ConverseModel.findById(msg.chatRoomId);

  const Msg = new MessageModel({
    chatRoomId: room._id,
    message: msg.message,
    senderId: user._id,
  });

  await Msg.save()
    .then((res) => {
      sk.emit("chat", res);
    })
    .catch((err) => console.error("Error saving message:", err));
};

const getAllMsgController = async (req, res) => {
  const { roomId } = req.body;

  const msgs = await MessageModel.find({ chatRoomId: roomId }).sort({
    created: 1,
  });

  res.json({
    type: "success",
    message: msgs,
  });
};

module.exports = {
  storeMessageController,
  createChatRoomController,
  getAllMsgController,
};
