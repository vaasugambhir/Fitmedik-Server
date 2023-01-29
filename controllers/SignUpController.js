import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserDetail from '../models/UserDetails.js';
import nodemailer from 'nodemailer';
import otpModel from '../models/Otp.js';

 
function generateOTP(){
    let otp = '';
    for(let i =0;i<=3;i++){
       var rand = Math.floor(Math.random()*9);
       otp = otp + rand;
    }
    return otp;
}
// export const otpTest = async(req,res)=>{
//   var transport = nodemailer.createTransport({
//   service:'gmail',
//   auth:{
//     user:"mahathirmohamed791@gmail.com",
//     pass:"bzfhpojafxjklkpl"
//   }
// });
//   const ExistToken = otpModel.findOne({owner:req.body.Email},(err,docs)=>{
//     if(err){
//       return res.status(400).json({msg:err})
//     }else{
//       if(docs){
//          return res.status(200).json({msg:"OTP is already sent to your Email"})
//       }else{
//          var newOtp = generateOTP();
//          const hashedToken =  bcrypt.genSalt(10,function(err,salt){
//          bcrypt.hash(newOtp,salt,function(err,hash){
//          const Token = new otpModel({
//             owner:req.body.Email,
//             token:hash
//           });
//           console.log(hash);
//           Token.save();
//         })
//     });
//     var mailOptions = {
//     from:'mahathirmohamed791@gmail.com',
//     to:'mahathirmohamed129@gmail.com',
//     subject:'Verify Account',
//     text:'Hello this otp is Verified'
//   };
//    transport.sendMail(mailOptions,function(err,info){
//      if(err){
//        console.log(err);
//      }
//      if(info){
//        console.log("Email success"+info.response)
//        return res.status(200).json({msg:"OTP sent to your email"});
//       }
//     })
//     return res.status(200).json({msg:"Something Went Wrong"})
  
//   //  mailTransport().sendMail({
//   //   from:'mahathirmohamed791@gmail.com',
//   //   to:'mahathirmohamed791@gmail.com',
//   //   subject:"verify your email account",
//   //   html:`<body>
//   //     <div>
//   //       <h1>Welcome To Fitmedik Family</h1>
//   //        <h3>${newOtp}</h3>
//   //     </div>
//   //   </body>`
//   //  });
  
   
//   }
//     }
//   })
  
// }

export const otpTest = async (req,res)=>{
     otpModel.findOne({owner:req.body.Email},(err,docs)=>{
    if(err){
      return res.status(400).json({msg:err})
    }
    if(docs){
        console.log(docs);
         return res.status(200).json({msg:"OTP is already sent to your Email!!"})
      }else{
         var newOtp = generateOTP();
         const hashedToken =  bcrypt.genSalt(10,function(err,salt){
         bcrypt.hash(newOtp,salt,function(err,hash){
         const Token = new otpModel({
            owner:req.body.Email,
            token:hash
          });
          Token.save();
          EmailSending(req.body.Email,newOtp,res);
          console.log(hash);
          
        })
    }
    )
  }})
}


const EmailSending = (Email,newOtp,res)=>{
  var transport = nodemailer.createTransport({
      service:'gmail',
      auth:{
        user:process.env.Email,
        pass:process.env.pass
      }
    });
    var mailOptions = {
      from:'mahathirmohamed791@gmail.com',
      to:Email,
      subject:'Verify Account',
      html:`<body>
       <div>
         <h1>Welcome To Fitmedik Family</h1>
          <h3>${newOtp}</h3>
        </div>
     </body>`
  };
   transport.sendMail(mailOptions,function(err,info){
     if(err){
       console.log(err);
     }
     if(info){
       console.log("Email success"+info.response)
       return res.status(200).json({msg:"OTP sent to your email"});
      }
    })
    return res.status(200).json({msg:"Otp send to your Email Successfully"});
  
}

export const CheckUser = (req,res)=>{
  UserDetail.findOne({Email:req.body.Email},(err,docs)=>{
    if(err){
      console.log(err)
    }
    if(docs){
      res.status(200).json({msg:"User Found"})
      console.log(docs);
    }else{
      res.status(202).json({msg:"User Not Found"})
    }
  })
}

export const CheckToken = async (req,res)=>{
  const TokenCheck = otpModel.findOne({owner:req.body.Email},(err,docs)=>{
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
}

export const SignUp=async(req,res)=>{
  try{
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.Password, salt, function(err, hash) {
      const FindUser = UserDetail.findOne({Email:req.body.Email},(err,docs)=>{
        if(err){
          return res.status(400).json({msg:"Something Went Wrong"})
        }else{
          if(docs){
            return res.status(201).json({msg:"This Email is Already Exist"})
          }else{
              const user = new UserDetail({
                Email:req.body.Email,
                Password:hash,
                FirstName:req.body.FirstName,
                LastName:req.body.LastName,
                Age:req.body.Age,
                Gender:req.body.Gender,
                Ethnicity:req.body.Ethincity,
                HospitalName:req.body.Hospital,
                ProfessionName:req.body.Profession,
                Salary:req.body.Salary,
                Department:req.body.Department,
                Wieght:req.body.Weight,
                HieghtInCms:req.body.Height,
                Bedtime:req.body.Bedtime,
                BreakfastTime:req.body.Breakfast,
              });
              user.save();
              console.log(user)
              return res.status(200).json({ msg: "Successfully Created"})
          }
        }
      })

    });
  });
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
            bcrypt.compare(req.body.Password,docs.Password,(err,results)=>{
              if(err){
                return res.status(400).json({msg:"something went wrong!!!"})
                console.log(err);
              }
              if(results){
                   const Token = jwt.sign({id:docs._id,Email:docs.Email},process.env.JWT_SECRET_KEY);
                   return res.status(200).json({msg: "Successfully Logged In"})     
              }else{
                return res.status(201).json({msg:"Invalid Password"})
              }
            })
          }else{
            console.log("item not present");
            res.status(202).json({msg:"Email not found please sign up to login"});
          }
        }
   });
    }catch(e){
        console.log(e);
    }
}