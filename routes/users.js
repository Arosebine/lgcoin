const express = require('express');
const { passwordReset, assignedPassword } = require('../controller/passwordReset.controller');
const { userSignup, queryAll, updateImage, updatePassword, queryAllUsers, userLogin } = require('../controller/user.controller');
const { verify_token, createUser } = require('../controller/userEmail.controller');
const upload = require('../utils/multer')
const router = express.Router();






/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/register', upload.single('file'), userSignup ); 
router.post('/forgotPassword', passwordReset );
router.get('/resetPassword', assignedPassword );
router.post('/create', upload.single('file'), createUser );
router.post('/verify_token/:id', verify_token );
router.get('/viewall', queryAll );
router.post('/updateImage', upload.single('file'), updateImage );
router.put('/updatePassword', updatePassword );
router.get('/view/:first_name', queryAllUsers );
router.get('/view/:username', queryAllUsers );
router.post('/login', userLogin );




module.exports = router;
