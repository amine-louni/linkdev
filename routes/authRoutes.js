const express = require('express');
const authController = require('../controllers/authController');
//const userController = require('../controllers/userController');

const router = express.Router();
// AUTH routes
router.route('/register').post(authController.register);
router.route('/login').post(authController.login);
router.route('/is-loggedin').get(authController.isLoggedIn);
router.route('/validate-email/:token').post(authController.validateEmail);
router.route('/forgot-password').post(authController.forgotPassword);
router.route('/reset-password/:token').patch(authController.resetPassword);
router
  .route('/update-password')
  .patch(authController.protect, authController.updatePassword);

module.exports = router;
