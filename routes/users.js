const express = require('express');
const { passwordReset, assignedPassword } = require('../controller/passwordReset.controller');
const { userSignup, queryAll, updateImage, updatePassword, queryAllUsers, userLogin, getTransactions, verifyEmail } = require('../controller/user.controller');
const { verify_token, createUser } = require('../controller/userEmail.controller');
const { isAuth } = require('../middleware/authenticate');
const upload = require('../utils/multer')
const router = express.Router();






/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/register',  userSignup ); 
router.post('/forgotPassword', passwordReset );
router.get('/resetPassword', assignedPassword );
router.put('/verify_token/:id', verify_token );
router.get('/viewall', queryAll );
router.put('/image/:id', isAuth, upload.single('file'), updateImage );
router.put('/password/:id', isAuth, updatePassword );
router.get('/view/:first_name', queryAllUsers );
router.get('/view/:username', queryAllUsers );
router.post('/login', userLogin );
router.get('/transactions', getTransactions );
router.get('/email_verify/:id', verifyEmail );

 


module.exports = router;
