import { Schema, model } from "mongoose";

const EventsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc:{
        type:String,
    },
    pic: {
        type: String,
        required: true,
        default:
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
      },
    type_of_event:{
        type:String,
        enum: ["online","offline"]
    },
    location:{
        type:String
    },
    duration:{
        type:String
    },
    price:{
        type:String
    },
    type_of_delivery:{
        type:String
    },
    about:{
        type:String
    },
    expectedOutcome:{type:String},
    link:{type:String},
    organization: {
        type: Schema.Types.ObjectId,
        ref: "organization",
        // required: true,
      },
    partner:{type:Schema.Types.ObjectId,ref:"TreatmentPartners"}
  },

  {
    timestamps: true,
  }
);

const Events = model("Events", EventsSchema);
export default Events;