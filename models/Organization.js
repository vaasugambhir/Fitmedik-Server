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

    employeeSize: {
      type: Number,
      required: true,
      min: 5,
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
  },

  {
    timestamps: true,
  }
);

const Organization = model("Organization", OrganizationSchema);
export default Organization;
