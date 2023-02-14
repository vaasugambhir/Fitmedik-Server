import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
import nodemailer from 'nodemailer' 
import OrganizationSchema from '../models/Organization.js'
import HospitalManager from "../models/HospitalManagerModel.js";
import Department from "../models/Department.js";
import DepartmentUser from "../models/DepartmentUser.js";
import TreatmentPartners from "../models/TreatmentPartners.js";
import Events from "../models/Events.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";
const {sign,verify} = jwt

dotenv.config();


async function main(email,token) {
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
          subject:"Setup Password",
          text:"setup password",
          html: `<b> <a href="http://localhost:3000/setupPassword/${token}"> link to setup password</a> </b>`, // html body
    });
  }

async function sendEmails(hospital_manager){
    for(let i = 0;i<hospital_manager.length;i++)
    {
        const token = jwt.sign({
            data: hospital_manager[i]
        }, process.env.HOSPITAL_MANAGER_SECRET_KEY, { expiresIn: '10d' }  
        );
        // console.log(token)
        main(hospital_manager[i].email,token).then((res)=>console.log(`email sent to ${hospital_manager[i].email}`))
            .catch((error)=>console.log(error));
    }
}

export const addOrganization = asyncHandler((req,res)=>{
    const {name, employee_size,poc_manager,active_state,location,typeOfHospital,city,website,country,subscription_size,operational_details,documents,hospital_manager,actions,subscription_date,partners} = req.body;
    let newOrganization;
    try {
        newOrganization = new OrganizationSchema({name,employee_size,poc_manager,active_state,location,typeOfHospital,city,website,country,subscription_size,operational_details,documents,actions,subscription_date,partners})
        newOrganization.save()
    } catch (error) {
        return res.json({"error":error})
    }

    try {
        if(newOrganization)
        {
            for(let i = 0;i<hospital_manager.length;i++)
            {
                let hospitalManager = new HospitalManager({name:hospital_manager[i].name,email:hospital_manager[i].email,phone:hospital_manager[i].phone,title:hospital_manager[i].title})
                hospitalManager.organization = newOrganization._id
                newOrganization.hospital_manager.push(hospitalManager)
                hospitalManager.save()
            }
            sendEmails(hospital_manager);
            return res.json(newOrganization)
        }
        else
            return res.send("failed")
    } catch (error) {
        return res.json({"error":error})
    }
})

export const updateOrganization = asyncHandler( async (req,res)=>{
    const {id,name, employee_size,poc_manager,active_state,location,typeOfHospital,city,website,country,subscription_size,operational_details,documents,actions,partners,subscription_date} = req.body;
    try {
        let organization = await OrganizationSchema.findById(id)
        if(!organization)return res.json({"error":"no organization exists for this id"})
        if(name)
            organization.name = name
        if(employee_size)
            organization.employee_size = employee_size
        if(poc_manager)
            organization.poc_manager = poc_manager
        if(active_state!=null)
            organization.active_state = active_state
        if(location)
            organization.location = location
        if(typeOfHospital)
            organization.typeOfHospital = typeOfHospital
        if(city)
            organization.city = city
        if(website)
            organization.website = website
        if(country)
            organization.country = country
        if(subscription_size)
            organization.subscription_size = subscription_size
        if(operational_details)
            organization.operational_details = operational_details
        if(documents)
            organization.documents = documents
        if(actions)
            organization.actions = actions
        if(subscription_date)
            organization.subscription_date = subscription_date
        if(partners)
            organization.partners = partners
        // let upd = false
        // for(let i = 0;i<organization.partners.length;i++)
        // {
        //     if(organization.partners[i].partnersid===partners.partnersid)
        //     {
        //         organization.partners[i] = partners
        //         upd = true
        //     }
        // }
        // if(!upd)
        // organization.partners.push(partners)
        organization.save()
        return res.json({"status":"successfully updated",organization})
    } catch (error) {
        return res.json({"error":error})
    }
})


export const getOrganization = asyncHandler( async (req,res)=>{
    try {
        const allOrganizations = await OrganizationSchema.find({})
        return res.json(allOrganizations)
    } catch (error) {
        return res.json({"error":error})
    }
})


export const addManager = asyncHandler( async(req,res)=>{
    const {name,email,phone,title,organization} = req.body;
    let newmanager
    try {
        if(!name || !email || !phone || !title || !organization)return res.json({"error":"please enter all fields"})
        const hospitalmanager = await HospitalManager.find({email:email})
        const data = hospitalmanager[0]
        if(data)return res.json({"error":"manager already exists"})
        newmanager = new HospitalManager({name,email,phone,title,organization})
        newmanager.save()
    } catch (error) {
        return res.json({"error":error})
    }

    if(newmanager)
    {
        let managers = [{name,email,phone,title,organization}]
        sendEmails(managers)
        return res.send(newmanager)
    }
    return res.json({"error":"not able to add new manager"})
})

export const getAllevents = asyncHandler(async(req,res)=>{
    try {
        const id = req.params.partnerId
        const data = await Events.find({partner:id})
        return res.json({data})
    } catch (error) {
        return res.json({"error":error})
    }
})

export const setupPassword = asyncHandler( async (req,res)=>{
    try {
        const {token} = req.params;
        jwt.verify(token, process.env.HOSPITAL_MANAGER_SECRET_KEY, function(err, decoded) {
            if (err) {
                return res.json({"error":err})
            }
            else {
                return res.json({"status":"sucess","token":token,"decoded":decoded});
            }
        });
    } catch (error) {
        return res.json({"error":error})
    }
})

export const addPassword = asyncHandler( async (req,res)=>{
    try {
        const {password} = req.body;
        const {token} = req.params;
        jwt.verify(token, process.env.HOSPITAL_MANAGER_SECRET_KEY, async function(err, decoded) {
            if (err) {
                return res.json({"error":err})
            }
            else {
                const email = decoded.data.email
                const hospitalmanager = await HospitalManager.find({email:email})
                const data = hospitalmanager[0]
                if(!data)return res.json({"error":"no manager found"})
                data.password = password
                data.save()
                return res.send(data)
            }
        });
    } catch (error) {
        return res.json({"error":error})
    }
})



export const allHospitalManagers = asyncHandler( async (req,res)=>{
    try {
        const data = await HospitalManager.find({})
        return res.json({data})
    } catch (error) {
        return res.json({"error":error})
    }
})

export const managerLogin = asyncHandler( async (req,res)=>{
    const {email,password} = req.body;
    try {
        if(!email || !password)return res.json({"error":"enter email id or password"})
        const hospitalmanager = await HospitalManager.find({email:email})
        const data = hospitalmanager[0]
        if(!data)return res.json({"error":"no manager found"})
        const isActive = await OrganizationSchema.findById(data.organization)
        if(!isActive.active_state)return res.json({"error":"contact backend team to activate your subscription"})
        if(data.password===password)
        {
            const token = jwt.sign({
                data: data
            }, process.env.HOSPITAL_MANAGER_SECRET_KEY1, { expiresIn: '10d' }  
            );
            return res.json(token)
        }
        else
            return res.status(401).json({"error":"incorrect credentials"})
    } catch (error) {
        return res.json({"error":error})
    }
})

function generateOTP() {
          
    let string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let OTP = '';
      
    var len = string.length;
    for (let i = 0; i < 6; i++ ) {
        OTP += string[Math.floor(Math.random() * len)];
    }
    return OTP;
}

async function mainOtp(email,otp) {
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
          subject:"OTP for reset password",
          text:otp,
          html: `<b>OTP ${otp}</b>`, // html body
    });
  }

export const forgetPassword = asyncHandler( async(req,res)=>{
    const {email} = req.body;
    try {
        if(!email)return res.json({"error":"enter email to reset password"})
        const hospitalmanager = await HospitalManager.find({email:email})

        if(!hospitalmanager)return res.json({"error":"no user found for this mail"})
        sendEmails(hospitalmanager)
        return res.status(200).json({"error":"email sent for setup password link"});
    } catch (error) {
        return res.json({"error":error})
    }
})

export async function verifyOtp(req,res){
    const {email,otp} = req.body;
    try {
        if(!email || !otp)return res.send("enter all fields")
        const hospitalmanager = await HospitalManager.find({email:email})
        const data = hospitalmanager[0]
        const userOtp = data.OTP

        if(otp===userOtp)
        {
            res.status(200).json({"status":"verified"})
            return;
        }
        else
        {
            res.status(401).json({"status":"not verified"})
            return;
        }
        }
        catch (error) {
        return res.json({"error":error})
    }
    res.json({"error":"invalid login credentials"})
    return;
}


export const singleHospitalManagers = asyncHandler( async(req,res)=>{
    try {
        const {organizationId} = req.params
        const allmanagers = await HospitalManager.find({organization:organizationId})
        return res.status(200).json({"data":allmanagers})
    } catch (error) {
        return res.json({"error":error})
    }
})

export const getDetailsOrganization = asyncHandler(async(req,res)=>{
    try {
        const {organizationId} = req.params
        const allmanagers = await HospitalManager.find({organization:organizationId})
        const organization = await OrganizationSchema.findById(organizationId).populate("partners")
        return res.json({allmanagers,organization})
    } catch (error) {
        return res.json({"error":error})
    }
})

async function mainUser(email) {
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
          subject:"Welcome to fitmedik",
        //   text:otp,
          html: `<b>link to download app</b>`, // html body
    });
  }


export const addDept = asyncHandler( async(req,res)=>{
    let department;
    // console.log(req.user)
    const {name,users} = req.body
    const organization = req.user.organization 
    try {
        const previouslydept = await Department.find({name:name})
        const userset = new Set(users)
        if(userset.size!=users.length)return res.json({"error":"some mails are duplicated"})
        if(previouslydept.length>0)return res.json({"error":"department for this name already exists"})
        if(users.length<1)return res.json({"error":"minimum 20 users should be there to add new department"})
        for(let i = 0;i<users.length;i++)
        {
            const email = users[i]
            const previouslyemail = await DepartmentUser.find({email:email})
            if(previouslyemail.length>0)return res.json({"error":"this email already exists"})
        }
        department = new Department({name,organization})
        department.save()
    } catch (error) {
        return res.send({"error":error})
        // return res.send(error)
    }

    try {
        
        if(department)
        {
            for(let i = 0;i<users.length;i++)
            {
                const email = users[i]
                let newUser = new DepartmentUser({email,department:department._id,organization})
                newUser.save()
            }
            for(let i = 0;i<users.length;i++)
            {
                const email = users[i]
                mainUser(email).then((res)=>console.log("email sent for download app",email))
                .catch((error)=>console.log(error));
            }
            return res.json({"data":department})
        }
        else
            return res.json({"error":"unable to save department"})
    } catch (error) {
        return res.json({"error":error})
    }
})

export const alldeptusers = asyncHandler(async(req,res)=>{
    try {
        const alldeptu = await DepartmentUser.find({})
        return res.json({alldeptu})
    } catch (error) {
        return res.json({error})
    }
})

export const allDept = asyncHandler( async(req,res)=>{
   let organizationid
    try {
        let token
        if(req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer"))
        {
            token = req.headers.authorization.split(" ")[1];
        }
        jwt.verify(token, process.env.HOSPITAL_MANAGER_SECRET_KEY1, async function(err, decoded) {
            if (err) {
                return res.json({"error":err})
            }
            else {
                organizationid = decoded.data.organization
            }
        });
    } catch (error) {
        return res.json({"error":error})
    }

    try {
        // console.log(organization,typeof(organization))
        const data = await Department.find({organization:organizationid})
        return res.send(data)
    } catch (error) {
        return res.json({"error":error})
    }
})

export const addEvent = asyncHandler( async (req,res)=>{
    try {
        const {name,desc,pic,type_of_event,location,duration,price,type_of_delivery,about,expectedOutcome,link,partner} = req.body;
        let even = new Events({name,desc,pic,type_of_event,location,duration,price,type_of_delivery,about,expectedOutcome,link,partner})
        even.save()
        return res.json(even)
    } catch (error) {
        return res.json({"error":error})
    }
})

export const updateEvent = asyncHandler( async (req,res)=>{
    try {
        const {id,name,desc,pic,type_of_event,location,duration,price,type_of_delivery,about,expectedOutcome,link,partner} = req.body;
        const even = await Events.findById(id)
        if(!even)return res.json({"error":"event not found"})
        if(name)
            even.name = name
        if(desc)
            even.desc = desc
        if(pic)
            even.pic = pic
        if(type_of_event)
            even.type_of_event = type_of_event
        if(location)
            even.location = location
        if(duration)
            even.duration = duration
        if(price)
            even.price = price
        if(type_of_delivery)
            even.type_of_delivery = type_of_delivery
        if(about)
            even.about = about
        if(expectedOutcome)
            even.expectedOutcome = expectedOutcome
        if(link)
            even.link = link   
        if(partner)
            even.partner = partner
        even.save()
        return res.json({even}) 
    } catch (error) {
        return res.json({"error":error})
    }
})

export const allEvents = asyncHandler( async (req,res)=>{
    try {
        const partner = req.params.id
        const events = await Events.find({partner})
        return res.json({events})
    } catch (error) {
        return res.json({"error":error})
    }
})

export const allTreatmentPartners = asyncHandler(async(req,res)=>{
    try {
        const allpartners = await TreatmentPartners.find({})
        return res.json({allpartners})
    } catch (error) {
        return res.json({error})
    }
})

export const addUser = asyncHandler( async (req,res)=>{
    try {
        const {emails,department} = req.body
        const dept = await Department.findById(department)
        if(!dept)return res.send("no dept found") 
        if(!emails)return res.send("enter emails")
        const organization = dept.organization
        for(let i = 0;i<emails.length;i++)
        {
            const email = emails[i]
            const user = await DepartmentUser.find({email:email})
            if(user.length==0)
            {
                let newuser = new DepartmentUser({email,department,organization})
                mainUser(email).then((res)=>console.log("email sent for download app",email))
                        .catch((error)=>console.log(error));
                newuser.save()
            }
        }
        return res.json({"status":"successfully sent all emails"})
    } catch (error) {
        return res.json({"error":error})
    }
} )

export const allUsers = async(req,res)=>{
    try {
        const {organization} = req.body;
        const data = await DepartmentUser.find({organization:organization})
        return res.send(data)
    } catch (error) {
        return res.json({"error":error})
    }
}


export const allUsersDept = async(req,res)=>{
    try {
        const deptId = req.params.departmentId
        const data = await DepartmentUser.find({department:deptId})
        return res.send(data)
    } catch (error) {
        return res.json({"error":error})
    }
}
export const userCount = async(req,res)=>{
    try {
        const organization = req.user.organization
        const data = await DepartmentUser.find({organization})
        let registeredUsers = 0
        let activeUsers = 0
        for(let i = 0;i<data.length;i++)
        {
            if(data[i].active)
                activeUsers += 1
            if(data[i].registered)
                registeredUsers += 1
        }
        return res.json({registeredUsers,activeUsers,total:data.length})
    } catch (error) {
        return res.json({"error":error})
    }
}

export const addPartner = asyncHandler( async(req,res)=>{
    try {
        const {heading,provider,about,pic,value,duration,thesis,expected_impact,link,onDashboard} = req.body;
        if(!heading || !provider || !about)return res.json({"error":"enter all details"})
        let newpartner = new TreatmentPartners({heading,provider,about,pic,value,duration,thesis,expected_impact,link,onDashboard})
        newpartner.save()
        return res.send(newpartner)
    } catch (error) {
        return res.json({"error":error})
    }
})

export const updatePartner = asyncHandler( async(req,res)=>{
    try {
        const {id,heading,provider,about,pic,value,duration,thesis,expected_impact,link,onDashboard} = req.body
        let partner = await TreatmentPartners.findById(id)
        if(!partner)return res.json({"error":error})
        if(heading)
            partner.heading = heading
        if(provider)
            partner.provider = provider
        if(about)
            partner.about = about
        if(pic)
            partner.pic = pic
        if(value)
            partner.value = value
        if(duration)
            partner.duration = duration
        if(thesis)
            partner.thesis = thesis
        if(expected_impact)
            partner.expected_impact = expected_impact
        if(link)
            partner.link = link
        if(onDashboard!=null)
            partner.onDashboard = onDashboard
        
        partner.save()
        return res.send(partner)
    } catch (error) {
        return res.json({"error":error})
    }
})

export const allQuestionare = async(req,res)=>{
    try {
        const parentOrganization = req.user.organization
        let allques = []
        const allusers = await User.find({parentOrganization})
        for(let i = 0;i<allusers.length;i++)
        {
            allques.push(allusers[i].questionare)
        }
        return res.json({allques})
    } catch (error) {
        return res.json({"error":error})
    }
}

export const allPartners = asyncHandler( async(req,res)=>{
    try {
        const allpartners = await TreatmentPartners.find({})
        return res.send(allpartners)
    } catch (error) {
        return res.json({"error":error})
    }
})

export const getOrganizationDetails = async(req,res)=>{
    try {
        const organization = req.user.organization
        const allmanagers = await HospitalManager.find({organization:organization})
        const data = await OrganizationSchema.findById(organization).populate("partners")
        return res.json({allmanagers,data})
    } catch (error) {
        return res.json({"error":error})
    }
}

export const allPartnersOrg = asyncHandler(async(req,res)=>{
    try {
        const organization = req.user.organization
        const org = await OrganizationSchema.findById(organization)
        const allPart = org.partners
        let data = []
        for(let i = 0;i<allPart.length;i++)
        {
            const part = await TreatmentPartners.findById(allPart[i])
            data.push(part)
        }
        return res.json({data})
    } catch (error) {
        return res.json({error})
    }
})

export const singlePartner = async(req,res)=>{
    try {
        const id = req.params.id
        const partner = await TreatmentPartners.findById(id)
        return res.send(partner)
    } catch (error) {
        return res.json({"error":error})
    }
}



// department_name
// email

// post method 
// input name of dept and array of members email
// return false


// support staff
// email
// email
// email
// email
// if length<20:
//     yeh galat hai 
// else:
//     add all and send email sending link of our app to download

// support staff click
// update add new staff member signup done or not active or not 
// delete or add user 25 
// check delete 20 true 

// email 
// sign up 
// email p cp -->> otp ->> details fill krega (ho,dept)