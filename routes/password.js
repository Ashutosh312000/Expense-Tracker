const express = require('express');

const passwordController = require('../controllers/password');

// const userauthentication=require('../middleware/auth')

const router = express.Router();

router.get('/resetpassword/:id',passwordController.resetpassword)
router.post('/forgotpassword',passwordController.forgotpassword);
router.get('/updatepassword/:resetpasswordid',passwordController.updatepassword)



module.exports = router;