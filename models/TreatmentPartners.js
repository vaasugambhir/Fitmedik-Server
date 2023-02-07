import { Schema, model } from "mongoose";

const TreatmentPartnersSchema = new Schema(
  {
    heading: {
      type: String,
      required: true,
    },
    provider:{
        type:String,
        required:true,
    },
    about:{
        type:String,
    },
    pic: {
        type: "String",
        required: true,
        default:
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
      },
      value:{
        type:String
      },
      duration:{
        type:String
      },
      thesis:{
        type:String
      },
      expected_impact:{
        type:String
      },
      link:{
        type:String
      },
      onDashboard:{type:Boolean,default:false},
      events:[{type: Schema.Types.ObjectId,ref: "Events"}],
  },

  {
    timestamps: true,
  }
);

const TreatmentPartners = model("TreatmentPartners", TreatmentPartnersSchema);
export default TreatmentPartners;