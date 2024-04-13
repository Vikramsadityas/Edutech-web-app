import {asynchandler} from "../utils/asynchandler.js"
import {apiresponse} from "../utils/apiresponse.js"
import {apierror} from "../utils/apierror.js"
import {User} from "../models/user.models.js"
import {uploadFile,deletefile} from "../utils/cloudinary.js"
import jwt  from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessandRefreshtoken=async(userid)=>{
    try {
        const user=await User.findById(userid);
        const accesstoken=user.generateaccesstoken();
        const refreshtoken=user.generaterefreshtoken();
        user.refreshtoken=refreshtoken;
        await user.save({validateBeforeSave:false});

        return {accesstoken,refreshtoken};
    } catch (error) {
        throw new apierror("Something went wrong while generating access and refresh token")
    }
}
const loginuser=asynchandler(async (req,res)=>{
    const {email ,username,password}=req.body;
    if( !(email || username))
    {
        throw new apierror(400,"username or email is required");
    }
    const user=await User.findOne({
        $or:[{username},{email}]
    })
    if(!user)
    {
        throw new apierror(404,"User does not exist");
    }
    const ispasswordcorrect=await user.ispasswordcorrect(password);
    if(!ispasswordcorrect)
    {
        throw new apierror(401,"Password invalid");
    }

    const{accesstoken,refreshtoken}= await generateAccessandRefreshtoken(user._id);
    const loggedinuser=await User.findOne(user._id).select(
        "-password -RefreshToken")
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accesstoken",accesstoken,options)
    .cookie("refreshtoken",refreshtoken,options)
    .json(
        new apiresponse(
            200,
            {
                user:loggedinuser,accesstoken,refreshtoken
            },
            "User Logged in Successfully"
        )
    )
})
const logoutuser=asynchandler(async (req,res)=>{
    await User.findByIdAndUpdate(req.user._id,{
        $unset:{
            RefreshToken:1
        }
    },
    {
        new:true
    })
    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accesstoken",options)
    .clearCookie("refreshtoken",options)
    .json(new apiresponse(200, {}, "User logged Out"))
})
const registeruser=asynchandler(async (req,res)=>{
    const {name,username,email,password}=req.body;
    if(
        [name,username,email,password].some((field)=>field?.trim() === "")
    )
    {
        throw new apierror(400,"All field are required");
    }

    const isexisted=await User.findOne({
        $or:[{email},{username}]
    })
    if(isexisted)
    {
        throw new apierror(409,"User with this email or username already exist");
    }
    

    const user=await User.create({
        name,
        email,
        password,
        username
    })
    const createduser=await User.findById(user._id).select(
        "-password -RefereshToken"
    )
    if(!createduser)
    {
        throw new apierror(500,"Something went wrong while registering user")
    }
    return res.status(201).json(
        new apiresponse(200,createduser,"User Created and Registered successfully")
    )  
})
const refreshAccessToken=asynchandler(async (req,res)=>{
    const incomingrefreshtoken= req.cookies.refreshtoken || req.body.refreshtoken
    
    const ans= await req.cookies.refreshtoken;
    console.log(ans);
    if(!incomingrefreshtoken)
    {
        throw new apierror(401,"Unauthorized request");
    }

    // try {
        const verifyingtoken=jwt.verify(incomingrefreshtoken,process.env.REFRESH_TOKEN_SECRET)
        const user=await User.findById(verifyingtoken?._id)
        if(!user)
        {
            throw new apierror(401,"Invalid refresh token");
        }
        console.log("2",incomingrefreshtoken,"55")
        if(incomingrefreshtoken!==user?.RefreshToken){
            throw new apierror(401,"Refresh Token Expired or used")
        }
        const options={
            httpOnly:true,
            secure:true
        }
        const {accesstoken,newrefreshtoken}=await generateAccessandRefreshtoken(user._id)
        return res
        .status(200)
        .cookie("accesstoken",accesstoken,options)
        .cookie("refreshtoken",newrefreshtoken,options)
        .json(
            new apiresponse(
                200,
                {accesstoken,refreshtoken:newrefreshtoken},
                "Access Token Refreshed"
                
            )
        )
    // } 
    // catch (error) {
    //     throw new apierror(401,error?.message ||"Invalid Refresh Token")
    //     // console.log('invalid refresh token');
        
    // }
})
const changepassword=asynchandler(async (req,res)=>{
    const {oldpassword,newpassword}=req.body
    const user=await User.findById(req.user?._id)
    const ispasswordcorrect=await user.ispasswordcorrect(oldpassword)
    if(!ispasswordcorrect)
    {
        throw new apierror(400,"Invalid Password")   
    }
    user.password=newpassword
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(
        new apiresponse(200,{},"Password Changed Successfully")
    )
})
const getcurrentuser=asynchandler(async (req,res)=>{
    return res
    .status(200)
    .json(
        new apiresponse(200,req.user,"Current user set successfully")
    )
})
const updateuserdetail=asynchandler(async (req,res)=>{
    const{name,email}=req.body
    const user=await User.findByIdAndUpdate(
        req.user._id,
        {
            name:name,
            email:email
        },
        {
            new:true
        }
    ).select("-password")

    return res
    .status(200)
    .json(
        new apiresponse(200,user,"Details Updated Successfully")
    )
})

export {loginuser,
        logoutuser,
        registeruser,
        refreshAccessToken,
        changepassword,
        getcurrentuser,
        updateuserdetail,
        } 