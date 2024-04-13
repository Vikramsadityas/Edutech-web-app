import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"
import { apierror } from '../utils/apierror.js';
          
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY, 
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET_KEY 
});

const uploadFile=async function(localFilepath){
    try {
        // console.log(localFilepath,"bbyyyy")
        if(!localFilepath) return null
            // console.log("Hi in if condn")
        // const response =await cloudinary.upload(localFilepath,{
        //     resource_type:'auto'
        // })
        const response = await cloudinary.uploader.upload(localFilepath,{
            resource_type:"auto"
        })
        // console.log("response here>>",response)
        // if(!response)
        // {
        //    console.log("gadbab here!!!")
        // }
        // console.log("File has been uploaded",response.url)
        fs.unlinkSync(localFilepath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilepath)
        return "file not upload here"
    }
}
const deletefile=async function(fileurl){
    try{
        await cloudinary.uploader.destroy(fileurl)
    }
    catch(error){
        throw new apierror(500,error?.message || "Cannot delete previous file")
    }
}

export {uploadFile,deletefile}