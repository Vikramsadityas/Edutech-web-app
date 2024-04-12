//by using promises
const asynchandler = (handleasync) => {
    return (req, res, next) => {
        Promise.resolve(handleasync(req, res, next)).catch((err) => next(err))
    }
}


//using try catch 
// const asynchandler=(handleasync)=>async(req,res,next)=>{
//     try {
//         await handleasync()
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success:false,
//             message:err.message
//         })
//         console.log('Error occured in async handler');

//     }
// }

export { asynchandler }