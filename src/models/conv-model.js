const { Schema, default: mongoose } = require("mongoose");

// 5 Datatypes
const Converse = new Schema({
  participants: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
  created: { type: Date, default: Date.now },
});

const Message = new Schema({
  chatRoomId: { type: mongoose.Schema.Types.ObjectId, ref: "Converse" },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String,
  created: { type: Date, default: Date.now },
});

const ConverseModel = mongoose.model("Converse", Converse);
const MessageModel = mongoose.model("Message", Message);

module.exports = { ConverseModel, MessageModel };
