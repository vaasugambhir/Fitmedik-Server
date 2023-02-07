import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail'
import nodemailer from 'nodemailer' 
import AdminModel from '../models/AdminModel.js';
import asyncHandler from "express-async-handler";
import * as jwt from '../auth/JWT.js'
const {createTokens} = jwt
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API)


async function main(email,otp) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "vedchourasia08@gmail.com", // generated ethereal user
      pass: "ylrssgydcmotpizy", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
        from:"vedchourasia08@gmail.com",
        to:email,
        subject:"OTP for login",
        text:otp,
        html: `<b>OTP ${otp}</b>`, // html body
  });

//   console.log("Message sent: %s", info.messageId);

//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

function generateOTP() {
          
    let string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let OTP = '';
      
    var len = string.length;
    for (let i = 0; i < 6; i++ ) {
        OTP += string[Math.floor(Math.random() * len)];
    }
    return OTP;
}

export const Admin = asyncHandler(async (req,res)=>{
    // let newAdmin = new AdminModel({
    //     OTP:"123456",
    //     name:"adminUser"
    // })
    try {
        // newAdmin.save()
        const {email,password} = req.body;
        const defEmail = process.env.EMAIL;
        const defPassword = process.env.PASSWORD
        
        if(defEmail===email && defPassword===password)
        {
            let otp = generateOTP()
            const adminuser = await AdminModel.find({name:"adminUser"})
            const user = adminuser[0]

            user.OTP = otp
            user.save()
            
            // res.cookie("access-token", accessToken, {
            //     maxAge: 60 * 60 * 24 * 30 * 1000,
            //     sameSite: 'strict',
            //     httpOnly: true,
            // });    
            main(email,otp).then((res)=>console.log("email sent"))
            .catch((error)=>console.log("mail not sent"));
            return res.json({"message":"otp sent"})
        }
        else
        {
            return res.json({"error":"invalid login credentials"})
        }
    } catch (error) {
        return res.json({"error":error})
    }
    return res.json({"error":"invalid login credentials"})
})

const getModelotp = async()=>{
    const adminuser = await AdminModel.find({name:"adminUser"})
    const user = adminuser[0]
    const otp = user.OTP
    return otp
}

export const AdminOTP = asyncHandler(async(req,res) => {
    try {
        const adminuser = await AdminModel.find({name:"adminUser"})
        const user = adminuser[0]
        const otp = user.OTP
        const {userOtp} = req.body;

        if(otp===userOtp)
        {
            const accessToken = createTokens(user);
            return res.status(200).json({"status":"verified",accessToken});

            // res.status(200).json({"status":"verified"})
        }
        else
        {
            return res.status(401).json({"status":"not verified"})
        }

        }
     catch (error) {
       return res.json({"error":error})
    }
    return res.json({"error":"invalid login credentials"})
})