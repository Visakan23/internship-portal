
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    rollNumber: {
      type: String,
      required: true,
      trim: true
    },
    internshipId: {
      type: String,
      required: true
    },
    internshipTitle: {
      type: String,
      required: true
    },
    company: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);
