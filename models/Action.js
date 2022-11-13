import { Schema, model } from "mongoose";

const ActionSchema = new Schema({
  parentOrganization: {
    type: Schema.Types.ObjectId,
    ref: "organization",
  },
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
  },
  view: {
    type: String,
    enum: ["hospital", "radiology", "neurology"],
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
      "gender",
      "ethnicity",
      "age groups",
    ],
    required: true,
  },

  isCompleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  duration: {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
});

const Action = model("Action", ActionSchema);
export default Action;
