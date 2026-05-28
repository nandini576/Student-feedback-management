import Feedback from "../models/Feedback.model.js";
import Question from "../models/Question.model.js";
import Course from "../models/Course.model.js";

const courseReport = async (req,res,next)=>{
    try{
        const {courseId}= req.params;
        
        // Get course info for student count (you may have enrollment data)
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({message: "Course not found"});
        }
        
        const feedbacks = await Feedback.find({courseId});
        
        // Calculate overall stats
        let totalRatingSum = 0;
        let totalRatingCount = 0;
        let ratingSum = {};
        let ratingCount = {};
        
        feedbacks.forEach(feedback =>{
            feedback.responses.forEach(r=>{
                if(typeof r.answer === "number"){
                    totalRatingSum += r.answer;
                    totalRatingCount++;
                    ratingSum[r.questionId] = (ratingSum[r.questionId] || 0) + r.answer;
                    ratingCount[r.questionId] = (ratingCount[r.questionId] || 0) + 1;
                }
            });
        });
        
        // Get question details for breakdown
        const questions = await Question.find();
        const questionBreakdown = questions.map(q => ({
            questionId: q._id,
            questionText: q.questionText,
            avgRating: ratingCount[q._id] ? (ratingSum[q._id] / ratingCount[q._id]).toFixed(1) : 'N/A',
            responseCount: ratingCount[q._id] || 0
        })).filter(q => q.responseCount > 0);
        
        const averageRating = totalRatingCount > 0 ? (totalRatingSum / totalRatingCount).toFixed(1) : 'N/A';
        
        // Mock participation rate (you can replace with actual enrollment data)
        const participationRate = 85; // Placeholder
        
        res.json({
            report: {
                totalResponses: feedbacks.length,
                averageRating,
                participationRate,
                questionBreakdown
            }
        });
    }catch(err){
        next(err)
    }
}
export {courseReport}