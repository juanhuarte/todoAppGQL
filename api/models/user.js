import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  lastname: {
    type: String,
    required: true,
    minlength: 2,
  },
  mail: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
  },
  folders: [
    {
      ref: "Folder",
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
});

export default mongoose.model("User", schema);
