import { Schema, model } from "mongoose";

const OrganizationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
    },
    employee_size:{
      type:String,
      required:true,
    },

    poc_manager:{
      user:{type: Schema.Types.ObjectId,
        ref: "user",},
      name:{type:String,required:true},
      email:{type:String,required:true},
      phone:{type:String},
      title:{type:String,required:true}
    },

    active_state:{
      type:Boolean,
      required:true,
    },

    location: {
      type: String,
      required: true,
      lowercase: true,
    },

    typeOfHospital: {
      type: String,
      required: true,
      lowercase: true,
    },

    city:{
      type:String,
      required:true,
    },

    website:{
      type:String,
    },

    country:{
      type:String,
      required:true,
    },

    subscription_size:{
      type:String,
      required:true,
    },

    operational_details:{
      annualSalNurse: {type:String,default:""},
      annualSalPhysician: {type:String,default:""},
      annualSalPhysicianSupport: {type:String,default:""},
      annualSalTechnician: {type:String,default:""},
      annualSalAdminManagement: {type:String,default:""},
      noOfBeds: {type:String,default:""},
      averageOccupancy: {type:String,default:""},
      avgOpd: {type:String,default:""},
      avgIpd: {type:String,default:""},
    },

    documents:{
      type:String
    },

    subscription_date:{type:Date},

    partners:[{
      type: Schema.Types.ObjectId,ref: "TreatmentPartners"
      // valueAdded:{type:String},
      // duration:{type:String},
      // Thesis:{type:String},
      // expected_impact:{type:String},
      // link:{Type:String},   
  }],

    hospital_manager:[{
      type: Schema.Types.ObjectId,
      ref: "HopitalManager"
    }],

    actions: [
      {
        type: Schema.Types.ObjectId,
        ref: "action",
      },
    ],
    departments: [
      {
        type: Schema.Types.ObjectId,
        ref: "department",
      },
    ],

    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],

  },

  {
    timestamps: true,
  }
);

const Organization = model("Organization", OrganizationSchema);
export default Organization;
