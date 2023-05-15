
const User=require('../models/user');
const sequelize = require('../util/database');
const Expense=require('../models/expense');

const Filesdownloaded=require('../models/filesdownloaded');


const UserServices=require('../services/userservices')
const S3Services=require('../services/S3services')



const isstringvalid=(string)=>{
    if(string=="" || string==undefined){
        return true;
    }
    else{
        return false;
    }
}



exports.getexpense=(req,res,next)=>{ 
    req.user.getExpenses() 
    .then((expense)=>{
        res.status(200).json(expense);
    })
    .catch(err=>console.log(err))
}


exports.postexpense= async(req,res,next)=>{
    const t=await sequelize.transaction();
    try{
       
        const {Amount,Description,Catogary}=req.body.expensedetails;
        if(isstringvalid(Amount) ||isstringvalid(Description) || isstringvalid(Catogary)){
         return res.json({message:'Fill Up The Blank Spaces'})
      }
      else{
        const expense=await Expense.create({Amount:Amount,Description:Description,Catogary:Catogary ,userId:req.user.id },{transaction:t});
         
            const response=await req.user.increment('total_expense',{by:parseInt(Amount),transaction:t});

           await t.commit();
           
             res.status(201).json({message:"Expense Is Added",expense})
      }
    }
    catch(err){
        await t.rollback();
        console.log(err)
        res.status(400).json({message:"Something Is Wrong",err})
    }

}

exports.deleteAddExpense = (req, res, next) => {
    const ExpenseId=req.params.ExpenseId; 
    req.user.getExpenses({where:{id:ExpenseId}})
    .then((expenses)=>{
        if(expenses.length <1){
            return res.json({message:"this expense does not exist"})
        }
        else{ 
        Expense.destroy({where:{id:ExpenseId},force:true})
        .then(result => {
          return res.json(result);
        })
        .catch(err => console.log(err));
        }
       
    })
    .catch(err => console.log(err));
};

exports.downloadexpense=async(req,res,next)=>{
    try{
        const userId=req.user.id
        const expenses = await UserServices.getexpenses(req);
    const stringifiedExpenses=JSON.stringify(expenses);
                                                    
        const filename=`Expense${userId}/${new Date()}.txt`; 
        const fileURL= await S3Services.uploadtoS3(stringifiedExpenses,filename);   
        
        const Linkupload=await Filesdownloaded.create({Link:fileURL,userId:userId});
        
        res.status(200).json({fileURL,success:true})              
    
    }
    catch(err){ 
        console.log(err)
        res.status(500).json({message:'failed',fileURL:'',err})
    }
   
}

exports.getIndex = (req, res, next) => {
    const EXPENSES_PER_PAGE=+req.query.per_page ||5;
    const page=+req.query.page ||1;
    Expense.findAndCountAll({where:{userId:req.user.id}} )
    .then(numExpenses =>{
      totalItems=numExpenses.count;
      return Expense.findAll({offset:((page-1)*EXPENSES_PER_PAGE),
        limit : EXPENSES_PER_PAGE,where:{userId:req.user.id}})
    })
      .then( expenses => {
        res.status(200).json({expenses:expenses,
          currentPage:page,
          hasPreviosPage: page > 1,
          hasNextPage:EXPENSES_PER_PAGE *page <totalItems,
          nextPage: page+1,
          previosPage: page-1,
          lastPage:Math.ceil(totalItems/EXPENSES_PER_PAGE)
        })      
      })
      .catch(err => {
        console.log(err);
      });
  };

