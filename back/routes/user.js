const express = require('express');
const router = express.Router();


const auth = require('../middlewares/auth')
const userCtrl = require('../controllers/user');

const multer = require('../middlewares/multer-config')

router.get('/:id',auth, userCtrl.getUser);
router.put('/:id', auth,multer,userCtrl.updateUser)
router.delete('/:id', auth,multer,userCtrl.deleteUser)

module.exports = router;