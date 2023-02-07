import { Schema, model } from "mongoose";

const AdminSchema = new Schema(
  {
    OTP: {
      type: String,
      required: true,
    },
    name:{
      type:String,
      required:true,
      default:"admin"
    }
  },

  {
    timestamps: true,
  }
);

const AdminModel = model("Admin", AdminSchema);
export default AdminModel;
