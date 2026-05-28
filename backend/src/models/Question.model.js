import mongoose from "mongoose";
const questionSchema= new mongoose.Schema({
    text:String,
    type:{type:String,enum:["rating","text"]},
    active:{type:Boolean,default : true}
})
export default mongoose.model("Question",questionSchema)