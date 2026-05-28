import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.model.js";
import Faculty from "../models/Faculty.model.js";
const register=async (req,res,next)=>{
    try{
        const {name,email,password,role,department,designation}=req.body;
        const existingUser= await User.findOne({email})
        if(existingUser)
            return res.status(400).json({message:"User already exists"})
        const user=await User.create({name,email,password,role});
        //If user is faculty
        if(role == "faculty"){
            await Faculty.create({userId:user._id,department,designation})
        }
        res.status(201).json({message:"User Registered Successfully"})
    }catch(err){
        console.log("error during registration")
        next(err);
    }
}

const login = async(req,res,next)=>{
    try{
    const {email,password} = req.body;
    const user=await User.findOne({email})
    if(!user)
        return res.status(404).json({message:"User Not Found"})
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch)
        return res.status(400).json({message:"Invalid credentials"})
    const token= jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:"1d"})
    res.json({token,role:user.role})
    }catch(err){
        next(err)
    }    
}
export {register,login}