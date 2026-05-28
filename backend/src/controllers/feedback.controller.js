import Feedback from "../models/Feedback.model.js"
import Faculty from "../models/Faculty.model.js"
import Course from "../models/Course.model.js"

const submitFeedback = async (req,res,next)=>{
    try{
        const studentId = req.user.id;
        const {courseId,responses} = req.body;
        //checking course exist or not
        const course = await Course.findById(courseId)
        if(!course)
            return res.status(404).json({message:"Course Not Found"})
        //getting faculty details
        const faculty = await Faculty.findById(course.facultyId)
        if (!faculty)
              return res.status(404).json({ message: "Faculty not found" });
        //checking duplicate feedback
        const existingFeedback = await Feedback.findOne({studentId,courseId})
        if(existingFeedback)
            return res.status(400).json({message:"Feedback already submitted"})
        const newFeedback = await Feedback.create({
            studentId,courseId,facultyId:faculty._id,responses
        })
        res.status(200).json({message:"Feedback submitted successfully"})       
    }catch(err){
        next(err)
    }
}

//Admin/Faculty views feedback for courses
const getCourseFeedback = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    let query = Feedback.find({ courseId })
      .populate("courseId", "courseName")
      .populate("facultyId")
      .populate("studentId", "name");

    const feedbacks = await query;
    res.json({feedback: feedbacks});

  } catch (error) {
    next(error);
  }
};

// Get all feedback (admin only)
const getAllFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find()
      .populate("courseId", "courseName")
      .populate("facultyId")
      .populate("studentId", "name email")
      .sort({submittedAt: -1});
    res.json({feedback});
  } catch (error) {
    next(error);
  }
};

// Get feedback for logged-in user (faculty sees their course feedback, student sees their submissions)
const getMyFeedback = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    let feedback;
    
    if (userRole === "faculty") {
      // Find faculty record
      const faculty = await Faculty.findOne({userId});
      if (!faculty) {
        return res.json({feedback: []});
      }
      // Get feedback for courses taught by this faculty
      feedback = await Feedback.find({facultyId: faculty._id})
        .populate("courseId", "courseName")
        .populate("studentId", "name")
        .sort({submittedAt: -1});
    } else if (userRole === "student") {
      // Get feedback submitted by this student
      feedback = await Feedback.find({studentId: userId})
        .populate("courseId", "courseName")
        .populate("facultyId")
        .sort({submittedAt: -1});
    } else {
      feedback = [];
    }
    
    res.json({feedback});
  } catch (error) {
    next(error);
  }
};

export {submitFeedback,getCourseFeedback,getAllFeedback,getMyFeedback}