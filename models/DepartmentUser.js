import { Schema, model } from "mongoose";

const DepartmentUserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },

    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    organization:{
      type:Schema.Types.ObjectId,
      ref:"Organization",
      required:true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    active:{
      type:Boolean,
      default:true
    },
    registered:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);

const DepartmentUser = model("DepartmentUser", DepartmentUserSchema);
export default DepartmentUser;