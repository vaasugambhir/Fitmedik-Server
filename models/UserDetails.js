import { Schema, model } from "mongoose";

const UserDetailSchema = new Schema(
  {
    Email: {
      type: String,
      lowercase: true,
    },
    Password: {
      type: String, 
    },
    FirstName:{
      type: String,
     
    },
    LastName:{
      type:String,
    },
    Age:{
        type: String,
    },
    Gender: {
      type: String,
      
      enum: ["Male", "female", "transgender", "non-binary", "other"],
    },
    Ethnicity: {
      type: String,
      
      enum: ["american native", "Asian", "white", "coloured", "other"],
    },
    HospitalName:{
        type:String
    },
    ProfessionName:{
        type:String
    },
    Salary: {
      type: String,
    },
    Department:{
     type:String
    },
    Wieght: {
      type: String,
      
    },
    HieghtInCms: {
      type: String,
      
    },
    Bedtime:{
        type:String
    },
    BreakfastTime:{
        type:String
    },
    workingHours: {
      type: String,
    }
}
);

const UserDetail = model("UserDetails", UserDetailSchema);
export default UserDetail;
