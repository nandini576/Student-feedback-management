import mongoose from "mongoose"
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
    name:String,
    email:{ type:String,unique:true},
    password:String,
    role:{
        type:String,
        enum :["student","faculty","admin"],
        default:"student"
    }
})
//runs every time before saving/creating a document in mongoDB
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})
export default mongoose.model("User",userSchema)