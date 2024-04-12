import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"
import { handleerror } from '../utils/apierror.js';
          
cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY, 
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET_KEY 
});

const uploadFile=async function(localFilepath){
    try {
        if(!localFilepath) return null
        const response =await cloudinary.uploader.upload(localFilepath,{
            resource_type:'auto'
        })
        // console.log("File has been uploaded",response.url)
        fs.unlinkSync(localFilepath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilepath)
        return null
    }
}
const deletefile=async function(fileurl){
    try{
        await cloudinary.uploader.destroy(fileurl)
    }
    catch(error){
        throw new handleerror(500,error?.message || "Cannot delete previous file")
    }
}

export {uploadFile,deletefile}