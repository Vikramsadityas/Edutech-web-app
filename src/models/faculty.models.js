import mongoose,{Schema} from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
const facultyschema=new Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    RefreshToken:{
        type:String,
    }
},{timestamps:true})

facultyschema.pre( 'save',async function(next){
    if(!this.isModified("password")) return next()
    this.password=await bcrypt.hash(this.password,10)
    next()
})

facultyschema.methods.ispasswordcorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

facultyschema.methods.generateaccesstoken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            fullname:this.fullname,
            username:this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
facultyschema.methods.generaterefreshtoken=function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const Faculty=mongoose.model("Faculty",facultyschema)