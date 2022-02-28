const router = require('express').Router();
const authController = require('./controller/auth.controller');
const validate = require('./controller/validation.controller');

router.post('/signup', validate.signupUser, authController.signupUser);
router.post('/login', validate.loginUser, authController.loginUser);
router.post('/verify-email', validate.verifyUser, authController.verifyUser)

router.post('/forgetPassword', validate.forgetPassword, authController.forgetPassword);
router.post('/reset-link/:token',validate.resetPassword, authController.resetPassword);



module.exports = router;