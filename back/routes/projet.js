const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const projCtrl = require('../controllers/projet');

const multer = require('../middlewares/multer-config')

router.post('/', auth,multer,projCtrl.createProject);
router.get('/:id', auth,projCtrl.getProject);
router.get('/', auth,projCtrl.getAllProject);
router.put('/:id', auth,multer,projCtrl.updateProject);
router.delete('/:id', auth,multer,projCtrl.deleteProject);


module.exports = router;