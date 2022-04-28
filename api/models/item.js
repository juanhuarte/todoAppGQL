import mongoose from "mongoose";

const schema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  folder: {
    ref: "Folder",
    type: mongoose.Schema.Types.ObjectId,
  },
});

export default mongoose.model("Item", schema);
