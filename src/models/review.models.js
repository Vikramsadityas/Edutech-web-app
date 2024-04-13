import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const reviewSchema=new Schema({
    comment:{
        type:String,
        required:true
    },
    video:{
        type:mongoose.Types.ObjectId,
        ref:"Video"
    },
    owner:{
        type:mongoose.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true})
reviewSchema.plugin(mongooseAggregatePaginate)
export const Review=mongoose.model("Review",reviewSchema)