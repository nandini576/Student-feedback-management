import Question from "../models/Question.model.js"
const createQuestion = async(req,res,next)=>{
    try{
        const {text,type}=req.body;
        if(!text || !type)
            return res.status(400).json({message:"Text and Type are required"})
        const question =await Question.create({text,text})
        res.status(201).json({message:"Question created Successfullly",question})
    }catch(err){
        next(err);
    }
}
const getQuestions = async (req,res,next)=>{
    try{
        const questions= await Question.find({active:true})
        res.json(questions)
    }catch(err){
        next();
    }
}
const updateQuestion  = async (req,res,next)=>{
    try{
        const question =await Question.findByIdAndUpdate(req.params.id,req.body,{new :true})
        if(!question)
            return res.status(404).json({message:"Question not found"})
        res.json({
            message: "Question updated successfully",
            question
        });
    }catch(err){
        next(err)
    }
}
const deleteQuestion = async (req, res, next) => {
    try {
        const question = await Question.findByIdAndUpdate(
            req.params.id,
            { active: false },
            { new: true }
        );

        if (!question)
            return res.status(404).json({ message: "Question not found" });

        res.json({ message: "Question deactivated successfully" });

    } catch (err) {
        next(err);
    }
};
export {
    createQuestion,
    getQuestions,
    updateQuestion,
    deleteQuestion
};
