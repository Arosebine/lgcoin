const express = require('express');
const { passwordReset, assignedPassword } = require('../controller/passwordReset.controller');
const { lgcoinBuy, lgcoinFlutterwave, lgcoinPaystack } = require('../controller/transaction.controller');
const { userSignup, queryAll, updateImage, updatePassword, queryAllUsers, userLogin, getTransactions, verifyEmail, referralLink, updateUser, deleteUser } = require('../controller/user.controller');
const { verify_token, createUser } = require('../controller/userEmail.controller');
const { isAuth } = require('../middleware/authenticate');
const { bankSignup, updateBankDetails, deleteBankDetails, bankDetails, getBankDetails, }= require('../controller/bank.controller');
const upload = require('../utils/multer')
const router = express.Router();






/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/register',  userSignup ); 
router.post('/login', userLogin );
router.post('/forgotPassword', passwordReset );
router.get('/resetPassword', assignedPassword );
router.put('/verify_token/:id', verify_token );
router.get('/viewall', queryAll );
router.put('/image/:username',  updateImage );
router.put('/password/:id', isAuth, updatePassword );
router.get('/view/:first_name', queryAllUsers );
router.get('/view/:username', queryAllUsers );
router.get('/transactions', getTransactions );
router.get('/email_verify/:id', verifyEmail );
router.get('/referral_verify/:referralCode', referralLink );
router.put('/updateuser', upload.single('image'), updateUser );
router.delete('/deleteUser/:username', deleteUser );



//payment channel
router.post('/flutterwave', lgcoinFlutterwave );
router.post('/paystack', lgcoinPaystack );


// Bank Details

router.post('/post', bankSignup );
router.get('/get_banks', bankDetails );
router.put('/bank_update', updateBankDetails );
router.get('/alldetails', getBankDetails );
router.delete('/delete_bank', deleteBankDetails );



 


module.exports = router;
