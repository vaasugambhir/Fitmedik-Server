import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserDetail from '../models/UserDetails.js';

export const SignUp=async(req,res)=>{
  try{
    const hash = await bcrypt.hash(req.body.Password,10);
   const user = new UserDetail({
     Email:req.body.Email,
    Password:hash,
    FirstName:req.body.FirstName,
    LastName:req.body.LastName,
    Age:req.body.Age,
    Gender:req.body.Gender,
    Ethnicity:req.body.Ethnicity,
    HospitalName:req.body.Hospital,
    ProfessionName:req.body.Profession,
    Salary:req.body.Salary,
    Department:req.body.Department,
    Wieght:req.body.Wieght,
    HieghtInCms:req.body.HieghtInCms,
    Bedtime:req.body.Bedtime,
    BreakfastTime:req.body.Breakfast,
   });
   await user.save();
   res.send("succesfully Created");
   console.log(user);
  }catch(err){
    console.log(err)    
  };
  
}

export const message = async (req,res)=>{
     res.send("hi");
}

export const Login=async(req,res)=>{
    try{
       const User = UserDetail.findOne({Email:req.body.Email},(err,docs)=>{
        if(err){
         console.log(err);
        }else{
          if(docs){
            console.log(docs);
            const Token = jwt.sign({id:docs._id,Email:docs.Email},process.env.JWT_SECRET_KEY);
            res.send(`succesfully token created ${Token}`);
          }else{
            console.log("item not present");
            res.send("Please Sign up to login");
          }
        }
   });
    }catch(e){
        console.log(e);
    }
}