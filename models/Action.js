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
    required: true,
  },

  actionType: {
    type: String,
    required: true,
  },

  isCompleted: {
    type: Boolean,
    default: false,
  },

  duration: {
    startDate: {
      type: String,
      required: true,
    },

    endDate: {
      type: String,
      required: true,
    },
  },
});

const Action = model("Action", ActionSchema);
export default Action;
