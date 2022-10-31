import { Schema, model } from "mongoose";

const OrganizationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
    },

    location: {
      type: String,
      required: true,
      lowercase: true,
    },

    typeOfHospital: {
      type: String,
      required: true,
      lowercase: true,
    },

    departments: [
      {
        type: Schema.Types.ObjectId,
        ref: "department",
      },
    ],

    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    actions: [
      {
        name: { type: String, required: true, lowercase: true },
        description: { type: String, required: true },
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
            "gender",
            "ethnicity",
            "age groups",
          ],
          required: true,
        },

        isCompleted: { type: Boolean, required: true, default: false },
        duration: {
          start: { type: String, required: true },
          end: { type: String, required: true },
        },
      },
    ],
  },

  {
    timestamps: true,
  }
);

const Organization = model("Organization", OrganizationSchema);
export default Organization;
