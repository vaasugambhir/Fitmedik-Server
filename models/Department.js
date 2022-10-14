import { Schema, model } from "mongoose";

const DepartmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
    },

    employeeSize: {
      type: Number,
      required: true,
    },

    parentOrganization: {
      type: Schema.Types.ObjectId,
      ref: "organization",
      required: true,
    },

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

const Department = model("Department", DepartmentSchema);
export default Department;
