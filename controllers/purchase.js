
const User=require('../models/user');

const Expense=require('../models/expense');

const Order=require('../models/order');

const jwt=require('jsonwebtoken') 

const Razorpay=require('razorpay')



const isstringvalid=(string)=>{
    if(string=="" || string==undefined){
        return true;
    }
    else{
        return false;
    }
}

function generateAccessToken(id,name,ispremiumuser){ 
    return jwt.sign({userId:id,name:name,ispremiumuser},process.env.JWT_TOKEN)
}

exports.getpremiummembership= async (req, res, next)=>{
    try{
        var rzp=new Razorpay({ 
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        })
        const amount=2500; 

        rzp.orders.create({amount,currency:"INR"},(err,order)=>{ 
           
            if(err){
                throw new Error(JSON.stringify(err));
            }
           
            req.user.createOrder({orderid:order.id, status:'PENDING'}).then(()=>{
                return res.status(201).json({order,key_id:rzp.key_id})
            }).catch(err=>{
                throw new Error(err);
            })
        })
        
    }
    catch(err){
        console.log(err);
        res.status(403).json({message:'something went wrong',error:err})
    }
}

exports.updatetransactionstatus=async(req,res,next)=>{ 
    try{
        const user=req.user;
        const {payment_id,order_id}=req.body;

        const updateorder=Order.findOne({where : {orderid: order_id} }) 
        .then(order => {
           return order.update({paymentid:payment_id,status:"SUCCESSFULL"});
        })
        
        const updateuserpremium=req.user.update({ispremiumuser:true}); 

        Promise.all([updateorder,updateuserpremium]) 
        .then(()=>{
            return res.status(202).json({success:true,message :"Transaction Successful",token:generateAccessToken(user.id,user.Name,user.ispremiumuser)})
        })
        .catch((err)=>{
            console.log(err);
            throw new Error(err);
        })
    }
    catch(err){
        console.log(err);
        throw new Error(err);
    }
}

exports.updatetransactionstatusfailed=async(req,res,next)=>{ 
    try{
        await Order.findOne({where : {orderid: req.body.order_id} })
        .then(order => {
           return order.update({status:"Failed"});
        })
        .then(()=>{
            return res.status(202).json({success:true,message :"Transaction Failed"})
        })
        .catch(err=>console.log(err))
    }
    catch(err){
        console.log(err);
        throw new Error(err);
    }
}