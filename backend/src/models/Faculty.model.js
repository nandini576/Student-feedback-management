import mongoose from 'mongoose'
const facultySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    department: { type: String, required: true },
    designation: { type: String, required: true }
}, { timestamps: true })
export default mongoose.model("Faculty",facultySchema)