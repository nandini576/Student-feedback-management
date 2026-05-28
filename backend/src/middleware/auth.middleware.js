import jwt from "jsonwebtoken"
const auth = async(req,res,next)=>{
    console.log("Headers received",req.headers)
    console.log("Auth Headers",req.headers.authorization)
    try{
        const authHeader= req.headers.authorization
        if(!authHeader)
            return res.status(401).json({message:"Authentication Required"})
        const tokenParts = authHeader.replace(/"/g,"").trim().split(" ")
        if(tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== "bearer")
            return res.status(401).json({message:"Authentication Required"})
        const token = tokenParts[1]
        const decoded = jwt.verify(token,process.env.JWT_SECRET)//if invalid directly control goes to catch
        req.user={id:decoded.id,role:decoded.role}
        next()

    }catch(err){
         return res.status(401).json({ message: "Invalid or expired token" });//next is not used because authentication error are handled immediately not send to global handler
    }
}
export default auth;