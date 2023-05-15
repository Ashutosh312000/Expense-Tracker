
const User=require('../models/user');

const Expense=require('../models/expense');
const sequelize = require('../util/database');




exports.getuserleaderboard=async (req,res,next)=>{
   
    try{
        const userleaderboardDetails=await User.findAll({
            attributes:['id','name','total_expense'],
            order:[['total_expense','DESC']] 
            
        });
     
        res. status (200).json(userleaderboardDetails)

        
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}