const express = require('express');

const userController = require('../controllers/user');


const router = express.Router();



router.post('/signup', userController.postuser);

router.post('/login', userController.loginuser);





module.exports = router;