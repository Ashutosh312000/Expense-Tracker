const getexpenses=(req,where)=>{
    return req.user.getExpenses(where);
}

module.exports={
    getexpenses
}