const express = require('express');

const FilesController = require('../controllers/files');

const userauthentication=require('../middleware/auth')

const router = express.Router();




router.get('/downloadfiles',userauthentication.authenticate ,FilesController.downloadfiles);



module.exports = router;