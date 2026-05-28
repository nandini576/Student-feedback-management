import mongoose from "mongoose";
const courseSchema = new mongoose.Schema({
    courseCode: { type: String, required: true },
    courseName: { type: String, required: true },
    semester: { type: String, required: true },
    academicYear: { type: String, required: true },
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty",
        required: true
    }
}, { timestamps: true })
export default mongoose.model("Course",courseSchema)