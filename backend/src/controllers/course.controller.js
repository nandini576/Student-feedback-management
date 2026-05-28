import Course from "../models/Course.model.js"
import Faculty from "../models/Faculty.model.js"
import User from "../models/User.model.js"

const createCourse = async (req,res,next)=>{
    try{
        const {courseCode,courseName,semester,academicYear,facultyId} = req.body
        const faculty=await Faculty.findById(facultyId);
        if(!faculty)
            return res.status(404).json({message:"Faculty Not Found"})
        const course = await Course.create({courseCode,courseName,semester,academicYear,facultyId})
        res.status(201).json(course);
    }catch(err){
        next(err)
    }
}

const getCourses = async(req,res,next)=>{
    try{
        const courses = await Course.find().populate({
            path:"facultyId",
            populate : {path:"userId",select:"name"}//finds faculty details-->user details-->name only retrieves
        })
        res.json({courses})
    }catch(err){
        next(err)
    }
}

// Get courses for logged-in faculty or student
const getMyCourses = async(req,res,next)=>{
    try{
        const userId = req.user.id;
        const userRole = req.user.role;
        let courses;
        
        if (userRole === "faculty") {
            // Find faculty record for this user
            const faculty = await Faculty.findOne({userId});
            if (!faculty) {
                return res.json({courses: []});
            }
            courses = await Course.find({facultyId: faculty._id}).populate({
                path:"facultyId",
                populate : {path:"userId",select:"name"}
            });
        } else if (userRole === "student") {
            // For now, return all courses for students (you can add enrollment logic later)
            courses = await Course.find().populate({
                path:"facultyId",
                populate : {path:"userId",select:"name"}
            });
        } else {
            courses = [];
        }
        
        res.json({courses});
    }catch(err){
        next(err)
    }
}

export {createCourse,getCourses,getMyCourses}