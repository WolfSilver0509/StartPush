const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/auth');
const multer = require('../middlewares/multer-config')

router.post('/signup',multer, authCtrl.signup);
router.post('/login', authCtrl.login);
router.get('/checkToken', authCtrl.checkToken);

module.exports = router;