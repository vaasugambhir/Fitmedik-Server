import { Schema, model } from "mongoose";
const tokenSchema = new Schema({
    owner:{
        type:String,
    },
    token:{
        type:String
    },
    createdAt:{
        type:Date,
        expire:600,
        default:Date.now()
    }
})

const otpModel = model("Tokens", tokenSchema);
export default otpModel; 