import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
    lowercase: true,
  },

  ageGroup: {
    type: Number,
    required: true,
  },

  gender: {
    type: String,
    required: true,
    lowercase: true,
  },

  Ethnicity: {
    type: String,
    required: true,
    lowercase: true,
  },

  Organization: {
    type: Schema.Types.ObjectId,
    required: true,
  },

  sleep_schedule: {
    type: String,
    required: true,
    lowercase: true,
  },

  dailyStepCount: {
    type: String,
    required: true,
    lowercase: true,
  },

  SleepHours: {
    type: String,
    required: true,
    lowercase: true,
  },

  WorkingHours: {
    type: String,
    required: true,
    lowercase: true,
  },
});

const User = model("User", UserSchema);
export default User;
