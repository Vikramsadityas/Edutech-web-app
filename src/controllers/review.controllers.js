import mongoose from "mongoose"
import {Review} from "../models/review.models.js"
import {apierror} from "../utils/apierror.js"
import {apiresponse} from "../utils/apiresponse.js"
import {asynchandler} from "../utils/asynchandler.js"

const addComment=asynchandler(async(req,res)=>{
    const {comment}=req.body
    console.log("2",comment)
    if(!comment)
    {
        throw new apierror(400,"Comment cannot be empty!!")
    }
    const commentuser=await Review.create({
        comment:comment
    })
    if(!commentuser)
    {
        throw new apierror(500,"Comment cannot added") 
    }
    const mycomment=await Review.findById(commentuser._id)
    return res
    .status(200)
    .json(new apiresponse(200,mycomment,"Comment added successfully"))
})
const deleteComment=asynchandler(async(req,res)=>{
    const {commentId}=req.params
    const commenttodelete=await Review.findByIdAndDelete(commentId)
    if(!commenttodelete){
        throw new apierror(400,"No such comment to delete")
    }
    return res.status(200).json(new apiresponse(200,commenttodelete,"Comment deleted successfully"))
})
const getVideoComments=asynchandler(async(req,res)=>{
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    // try {
        const allcomments=await Review.aggregate([
            {
                $match:{
                    video:videoId
                }
            },
            {
                $lookup:{
                    from:'videos',
                    localField: 'video',
                    foreignField: '_id',
                    as: 'video_info'
                }
            }
        ])  
        if(!allcomments)
        {
            throw new apierror(400,"Comments cannot fetched")
        } 
        const options={
            page:page,
            limit:limit
        }
        const data=await Review.aggregatePaginate(
            allcomments,
            options
        )         
        if(!data)
        {
            throw new apierror(500,"Comment not found")
        }
        return res .status(200).json(new apiresponse(200,data,"Comment fetched successfully"))
    // } 
    // catch (error) {
    //     throw new apierror(error)
    // }
}) 
const updateComment=asynchandler(async(req,res)=>{
    const {commentId}=req.params
    const{newcomment}=req.body
    const commenttoupdate=await Review.findByIdAndUpdate(commentId,{
            comment:newcomment
    },{new:true})
    if(!commenttoupdate)
    {
        throw new apierror(400,"No such comment found")
    }
    return res.status(200).json(new apiresponse(200,commenttoupdate,"Comment updated successfully"))
})

export {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment
}