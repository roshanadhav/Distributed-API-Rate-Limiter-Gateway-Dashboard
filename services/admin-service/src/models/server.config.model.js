import mongoose from "mongoose";

const ServerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
      unique: true,
    },

    weight: {
      type: Number,
      default: 1,
    },

    enabled: {
      type: Boolean,
      default: true,
    },

    tags: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Server", ServerSchema);