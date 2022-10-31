import mongoose, { Schema, model } from "mongoose";

const ActionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
    },

    duration: {
      start: {
        type: String,
        required: true,
      },
      end: {
        type: String,
        required: true,
      },
    },

    view: {
      type: String,
      enum: ["organization", "department"],
      required: true,
    },

    actionType: {
      type: String,
      enum: [
        "average burnout trend",
        "work life balance",
        "physical fatigue",
        "mood",
        "sleep quality",
        "team support",
        "high risk profession",
        "high risk gender",
        "high risk ethnicity",
        "high risk age groups",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: ["completed", "pending"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Action = model("Action", ActionSchema);
export default Action;
