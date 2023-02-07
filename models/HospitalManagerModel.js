import { Schema, model } from "mongoose";

const HospitalManagerSchema = new Schema({
  user:{type: Schema.Types.ObjectId,ref: "user",},
  name:{type:String,required:true},
  email:{type:String,required:true},
  phone:{type:String},
  title:{type:String,required:true},
  password:{type:String,required:true,default:"jajkfjsd121514@#4qji"},
  organization:{type: Schema.Types.ObjectId,ref: "Organization"},
  OTP: {
    type: String,
    required: true,
    default:"akjafiauti1387687afi"
  },
},

{
  timestamps: true,
});

const HospitalManager = model("HopitalManager", HospitalManagerSchema);
export default HospitalManager;
