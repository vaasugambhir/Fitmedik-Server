import { Schema, model } from "mongoose";
const QuestionaireSchema = new Schema({
    question:{
        type:String,
    }
})

const QuestionaireModel = model("Questionaire", QuestionaireSchema);
export default QuestionaireModel; 