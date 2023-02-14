import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import DepartmentUser from '../models/DepartmentUser.js';
import Events from '../models/Events.js';
import Organization from '../models/Organization.js';
import otpModel from '../models/Otp.js';
import User from '../models/User.js';
import OrganizationSchema from '../models/Organization.js'

export const mailTransport = () =>  nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port:2525,
  auth: {
    user:"76cc7491761f68",
    pass:"37b91c3a913ccc"
  }
});
 
function generateOTP(){
    let otp = '';
    for(let i =0;i<=3;i++){
       var rand = Math.floor(Math.random()*9);
       otp = otp + rand;
    }
    return otp;
}

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


export const otpTest = async(req,res)=>{
  try {
    const ExistToken = otpModel.findOne({owner:req.body.email},(err,docs)=>{
      if(err){
        return res.status(400).json({msg:err})
      }else{
        if(docs){
           return res.status(200).json({msg:"OTP is already sent to your Email"})
        }else{
           var newOtp = generateOTP();
           const hashedToken =  bcrypt.genSalt(10,function(err,salt){
           bcrypt.hash(newOtp,salt,function(err,hash){
           const Token = new otpModel({
              owner:req.body.email,
              token:hash
            });
            console.log(hash);
            Token.save();
          })
      });
    
    //  mailTransport().sendMail({
    //   from:'mahathirmohamed791@gmail.com',
    //   to:req.body.Email,
    //   subject:"verify your email account",
    //   html:`<body>
    //     <div>
    //       <h1>Welcome To Fitmedik Family</h1>
    //        <h3>${newOtp}</h3>
    //     </div>
    //   </body>`
    //  });

     main(req.body.email,newOtp).then((res)=>console.log("email sent"))
            .catch((error)=>console.log("mail not sent"));
            return res.json({"message":"otp sent"})
    
     return res.status(200).json({msg:"OTP sent to your email"});
    }
      }
    })
    
  } catch (error) {
    return res.json({"error":error})
  }
  
}

export const verifyemail = async(req,res)=>{
  try {
    const email = req.body.email
    // const dept = await DepartmentUser.findOne({email})
    // if(dept===null)
    // {
    //   return res.json({"error":"invalid user to signup"})
    // }
    // const FindUser = await User.findOne({email:req.body.email})
    //   if(FindUser)
    //     return res.json({"error":"user already created"})
    let user = await otpModel.findOne({owner:email})
    let otp = generateOTP()
    if(user)
    {
      user.token = otp;
    }
    else
    {
      user = new otpModel({owner:email,token:otp})
    }
    user.save()
    
      main(req.body.email,otp).then((res)=>console.log("email sent"))
            .catch((error)=>console.log("mail not sent"));
        return res.json({"message":"otp sent",user,otp})

  } catch (error) {
    return res.json({error})
  }
}

export const checkOtp = async(req,res)=>{
  try {
    const email = req.body.email
    const otp = req.body.otp
  
    const userotp = await otpModel.findOne({owner:email})
    // return res.json({userotp})
    if(!userotp)
      return res.json({"error":"user not exists or otp expired"})
    if(userotp.token==otp)
    {
      return res.json({"status":"success"})
    }
    return res.json({"error":"incorrect otp",userotp,otp})
  } catch (error) {
    return res.json({error})
  }
}

export const CheckToken = async (req,res)=>{
  try {
    const TokenCheck = otpModel.findOne({owner:req.body.email},(err,docs)=>{
      if(err) { 
        res.status(400).json({msg:err})
      }else{
        if(!docs){
          return res.status(200).json({msg:"Your OTP is Expired"})
        }
        if(docs){
          bcrypt.compare(req.body.token,docs.token,(err,result)=>{
            if(err){
              return res.status(400).json({msg:"Something Went Wrong"})
            }
            if(result){
               return res.status(200).json({msg:"Successfully Verified"})
            }else{
              return res.status(200).json({msg:"Please Enter Valid OTP"})
            }
          })
        }
      }
    }
      ) 
    return res.send(" something went wrong ")
    
  } catch (error) {
    return res.json({"error":error})
  }
}


export const SignUp=async(req,res)=>{
  try{
    const email = req.body.email
    const dept = await DepartmentUser.findOne({email})
    if(dept===null)
    {
      return res.json({"error":"invalid user to signup"})
    }
    const parentOrganization = dept.organization
    const org = await OrganizationSchema.findById(parentOrganization)
    const FindUser = await User.findOne({email:req.body.email})
      if(FindUser)
        return res.json({"error":"user already created"})
        let otp = generateOTP()
      bcrypt.hash(req.body.password, 10).then(function(hash){
      const user = new User({
        email:req.body.email,
        password:hash,
        name:req.body.name,
        dob:req.body.dob,
        gender:req.body.gender,
        ethnicity:req.body.ethnicity,
        parentOrganization:parentOrganization,
        profession:req.body.profession,
        salary:req.body.salary,
        weight:req.body.weight,
        heightInCms:req.body.heightInCms,
        sleepSchedule:req.body.sleepSchedule,
        department:dept.department,
        otp:otp
      });
      user.save();
      org.users.push(user)
      org.save()
      dept.user = user
      dept.save()
      dept.registered = true 
      const Token = jwt.sign({data:user},process.env.JWT_SECRET_KEY);
      return res.status(200).json({"token": Token})
      // return res.status(200).json({user})
    }).catch((error)=>{return res.send(error)})
  }catch(err){
    return res.json({"error":err})
  };
  
}

export const message = async (req,res)=>{
     res.send("hi");
}

export const Login=async(req,res)=>{
    try{
      const email = req.body.email
      const dept = await DepartmentUser.findOne({email})
      if(dept===null)
      {
        return res.json({"error":"invalid user to login"})
      }
      if(!dept.active || !dept.registered)return req.json({"error":"invalid user to login"})
      const password = req.body.password
      if(!email || !password)return res.json({"error":"enter email id and password both"})
      const user = await User.findOne({email})
      if(!user)return res.json({"error":"no user found"})
      const isActive = await Organization.findById(user.parentOrganization)
      if(!isActive.active_state)return res.json({"error":"contact backend team to activate your subscription"})
      
        bcrypt.compare(password, user.password).then(function(result) {
          if(!result)
          {
            return res.status(201).json({"error":"Invalid Password"})
          }
          else
          {
            const Token = jwt.sign({data:user},process.env.JWT_SECRET_KEY);
            return res.status(200).json({"token": Token})     
          }
      }).catch((error)=>{return res.status(400).json({"error":"something went wrong!!!"})});
    }catch(e){
      return res.json({"error":e})
    }
}


export const allAppUsers = async (req,res)=>{
  try {
    const data = await User.find({});
    return res.json({data})
  } catch (error) {
    return res.json({"error":error})
  }
}

export const allEventsUser = async(req,res)=>{
  try {
    const organization = req.user.parentOrganization
    const events = await Events.find({organization})
    return res.json({events})
  } catch (error) {
    return res.json({"error":error})
  }
}

export const uploadjournal = async(req,res)=>{
  try {
    return res.send("to be done")
  } catch (error) {
    return res.json({"error":error})
  }
}

export const allDetails = async(req,res)=>{
  try {
    const id = req.user._id;
    const userDetails = await User.findById(id)
    return res.json({userDetails})
  } catch (error) {
    return res.json({"error":error})
  }
}

export const updateUser = async(req,res)=>{
  try {
    const {
      name,
      dob,
      gender,
      ethnicity,
      profession,
      salary,
      weight,
      heightInCms,
      sleepSchedule,
      questionare
    } = req.body;

    const userid = req.user._id;
    const user = await User.findById(userid);
    if(name)
      user.name = name;
    if(dob)
      user.dob = dob;
    if(gender)
      user.gender = gender;
    if(ethnicity)
      user.ethnicity = ethnicity
    if(profession)
      user.profession = profession
    if(salary)
      user.salary = salary
    if(weight)
      user.weight = weight
    if(heightInCms)
      user.heightInCms = heightInCms
    if(sleepSchedule)
      user.sleepSchedule = sleepSchedule
    if(questionare)
      user.questionare.push(questionare);
    user.save()
    return res.json({user})
  } catch (error) {
    return res.json({"error":error})
  }
}