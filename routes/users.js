const express = require('express');
const { passwordReset, assignedPassword } = require('../controller/passwordReset.controller');
const { userSignup, queryAll, updateImage, updatePassword, queryAllUsers, userLogin, getTransactions } = require('../controller/user.controller');
const { verify_token, createUser } = require('../controller/userEmail.controller');
const { isAuth } = require('../middleware/authenticate');
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
router.put('/verify_token/:id', verify_token );
router.get('/viewall', queryAll );
router.put('/image/:id', isAuth, upload.single('file'), updateImage );
router.put('/password/:id', isAuth, updatePassword );
router.get('/view/:first_name', queryAllUsers );
router.get('/view/:username', queryAllUsers );
router.post('/login', userLogin );
router.get('/transactions', getTransactions );

 


module.exports = router;
