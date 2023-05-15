const express = require('express');

const purchaseController = require('../controllers/purchase');

const userauthentication=require('../middleware/auth')

const router = express.Router();


router.get('/premiummembership',userauthentication.authenticate ,purchaseController.getpremiummembership);

router.post('/updatetransactionstatus',userauthentication.authenticate ,purchaseController.updatetransactionstatus);
router.post('/updatetransactionstatusfailed',userauthentication.authenticate ,purchaseController.updatetransactionstatusfailed);




module.exports = router;