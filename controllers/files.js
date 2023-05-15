
const User=require('../models/user');

const Expense=require('../models/expense');

const Filesdownloaded=require('../models/filesdownloaded');


exports.downloadfiles=async (req,res,next)=>{
    try{
        const files=await req.user.getFilesdownloadeds();
        return res.status(200).json({success:true,files});
    }
    catch (err){
        console.log(err);
        return res.status(500).json('Something went wrong');
    }
}




