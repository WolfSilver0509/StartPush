const express = require('express');
const router = express.Router();


const auth = require('../middlewares/auth')
const userCtrl = require('../controllers/user');


router.get('/:id',auth, userCtrl.getUser);
router.put('/:id', auth,userCtrl.updateUser)
router.delete('/:id', auth,userCtrl.deleteUser)

module.exports = router;