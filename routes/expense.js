const express = require('express');

const expenseController = require('../controllers/expense');

const userauthentication=require('../middleware/auth')

const router = express.Router();


router.post('/postexpense',userauthentication.authenticate, expenseController.postexpense);

router.get('/getexpense',userauthentication.authenticate ,expenseController.getexpense);
router.get('/getIndex',userauthentication.authenticate ,expenseController.getIndex);
router.delete('/deleteAddExpense/:ExpenseId',userauthentication.authenticate, expenseController.deleteAddExpense);
router.get('/download',userauthentication.authenticate ,expenseController.downloadexpense);


module.exports = router;