import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },

  // // password: {
  // //   type: String,
  // //   required: true,
  // // },

  // // name: {
  // //   type: String,
  // //   required: true,
  // //   lowercase: true,
  // // },

  profession: {
    type: String,
    required: true,
    lowercase: true,
  },

  age: {
    type: Number,
    required: true,
  },

  gender: {
    type: String,
    required: true,
    lowercase: true,
  },

  ethnicity: {
    type: String,
    required: true,
    lowercase: true,
  },

  organization: {
    type: Schema.Types.ObjectId,
    ref: "organization",
    required: true,
  },

  department: {
    type: Schema.Types.ObjectId,
    ref: "department",
    required: true,
  },

  cvd: {
    type: Number,
  },

  sleepQuality: {
    type: Number,
  },

  stress: {
    type: Number,
  },

  burnout: [
    {
      type: Number,
    },
  ],

  // sleep_schedule: {
  //   type: String,
  //   required: true,
  //   lowercase: true,
  // },

  // dailyStepCount: {
  //   type: String,
  //   required: true,
  //   lowercase: true,
  // },

  // SleepHours: {
  //   type: String,
  //   required: true,
  //   lowercase: true,
  // },

  // WorkingHours: {
  //   type: String,
  //   required: true,
  //   lowercase: true,
  // },
});

const User = model("User", UserSchema);
export default User;
