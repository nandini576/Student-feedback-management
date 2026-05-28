import mongoose from "mongoose";
const feedbackSchema  = new mongoose.Schema({
    studentId : {type:mongoose.Schema.Types.ObjectId,ref:"User", required: true},
    courseId : {type:mongoose.Schema.Types.ObjectId,ref:"Course", required: true},
    facultyId : {type:mongoose.Schema.Types.ObjectId,ref:"Faculty", required: true},
    responses :[
        {
            questionId : {type : mongoose.Schema.Types.ObjectId,ref:"Question", required: true},
            answer :{ type:mongoose.Schema.Types.Mixed , required:true}
        }
    ],
    submittedAt :{type:Date,default:Date.now}

},{ timestamps: true })
export default mongoose.model("Feedback",feedbackSchema)