const referralCodeGenerator = require('referral-code-generator');






const code = referralCodeGenerator.custom('lowercase', 3, 7)
console.log(code);

const tee = referralCodeGenerator.custom('lowercase', 3, 10, 'user');
console.log(tee);