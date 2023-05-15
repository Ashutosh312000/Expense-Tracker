const express = require('express');

const premiumController = require('../controllers/premium');

const userauthentication=require('../middleware/auth')

const router = express.Router();


router.get('/showleaderboard',userauthentication.authenticate ,premiumController.getuserleaderboard);



module.exports = router;