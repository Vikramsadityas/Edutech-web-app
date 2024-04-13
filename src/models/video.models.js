import mongoose, { Schema } from "mongoose";
const videoSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    videoFile:{
        type:String,
        required:true
    },
    Owner:{
        type:Schema.Types.ObjectId,
        ref:"Faculty"
    }
},{timestamps:true})

export const Video=mongoose.model("Video",videoSchema)