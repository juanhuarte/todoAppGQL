import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
  },
  items: [
    {
      ref: "Item",
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
});

export default mongoose.model("Folder", schema);
