import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.models.js"
import { User } from "../models/user.models.js"
import { apierror } from "../utils/apierror.js"
import { apiresponse } from "../utils/apiresponse.js"
import { asynchandler } from "../utils/asynchandler.js"
import { deletefile, uploadFile } from "../utils/cloudinary.js"

const publishAVideo=asynchandler(async(req,res)=>{
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video
    if(!req.user._id)
    {
        throw new apierror(400,"User Id is invalid")
    }
    
        try {
            const videolocalpath=req.files?.videoFile[0]?.path;
            if(!videolocalpath)
            {
                throw new apierror(400,"Video2 file must be present")
            }
            console.log(videolocalpath,"local path here")
            const video=await uploadFile(videolocalpath);
            console.log(video,"here is the video");
            if(!video)
            {
                throw new apierror(400,"Video2 here not uploaded")
            }
            const videouser=await Video.create({
                videoFile:video.url,
                title:title,
                description:description,
            })
            if(!await Video.find(videouser._id))
            {
                throw new apierror(400,"videouser empty")
            }
            const isuploaded=await Video.find(videouser._id)
            console.log("1",isuploaded);
            if(!isuploaded)
            {
                throw new apierror(500,"Video cannot uploaded")
            }
            return res.status(200).json(
                new apiresponse(200,isuploaded,"Video uploaded successfully")
            )
        } catch (error) {
            throw new apierror(500,"Cannot upload videos not now!!")
        }
})

const deleteVideo=asynchandler(async(req,res)=>{
    const { videoId } = req.params
    const videotodelete=await Video.findById(videoId)
    if(!videotodelete){
        throw new apierror(400,"Video file not present")
    }
    const videopath=videotodelete.videoFile?videotodelete.videoFile:null
    if(!videopath)
    {
        throw new apierror(400,"No video to Delete")
    }
    await deletefile(videopath)
    const video=await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                videoFile:""
            }
        },
        {new:true}
    )
        return res.status(200).json(new apiresponse(200,video,"Video deleted Successfully"))

})

const updateVideo=asynchandler(async(req,res)=>{
    const { videoId } = req.params
    const {title,description}=req.body
    //TODO: update video details like title, description, thumbnail
    const video=await Video.findByIdAndUpdate(videoId,{
        title,
        description,
    })
    const isuploaded=await Video.find(video._id)
    return res.status(200).json(new apiresponse(200,isuploaded,"Video details updated successfully"))
})
export {
    publishAVideo,
    deleteVideo,
    updateVideo
}