import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    name: {
      type: String,
      required: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    dob: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "transgender", "non-binary", "other"],
    },

    ethnicity: {
      type: String,
      required: true,
      enum: ["american native", "asian", "white", "coloured", "other"],
    },

    parentOrganization: {
      type: Schema.Types.ObjectId,
      ref: "organization",
      required: true,
    },

    profession: {
      type: String,
      required: true,
      enum: ["nurse", "student", "staff", "it", "doctor"],
    },

    salary: {
      type: Number,
      required: true,
    },

    department: {
      type: Schema.Types.ObjectId,
      ref: "department",
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },

    heightInCms: {
      type: Number,
      required: true,
    },

    sleepSchedule: [
      {
        start: {
          type: String,
        },
        end: {
          type: String,
        },
      },
    ],

    mood: [
      {
        moodType: {
          type: String,
        },
        percentage: {
          type: Number,
        },
      },
    ],

    health_data: [
      {
        date: String,
        step_count: Number,
        interaction: {
          working_alone: Number,
          working_with_colleagues: Number,
        },
        sleep_hours: Number,
        working_hours: Number,
        vulnerability: Number,
        burnout: Number,
      },
    ],
    lastIn: String,
  },

  {
    timestamps: true,
  }
);

const User = model("User", UserSchema);
export default User;
