import User from "../models/User.model.js"
import Faculty from "../models/Faculty.model.js";
import Course from "../models/Course.model.js";
const getAllUsers = async (req,res,next)=>{
    try{
         const users = await User.find({ role: { $ne: "admin" } })
                                .select("-password");//selects all except passwords except admin
        res.json({users})

    }catch(err){
        next(err)
    }
}


const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // If faculty, check courses
    if (user.role === "faculty") {
      const faculty = await Faculty.findOne({ userId: user._id });

      const courses = await Course.find({ facultyId: faculty._id });

      if (courses.length > 0) {
        return res.status(400).json({
          message: "Cannot delete faculty assigned to courses"
        });
      }

      await Faculty.findByIdAndDelete(faculty._id);
    }

    await User.findByIdAndDelete(user._id);

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    next(err);
  }
};
export {getAllUsers,deleteUser}