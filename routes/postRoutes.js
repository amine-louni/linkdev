const express = require('express');
const { check, validationResult } = require('express-validator');
const authController = require('../controllers/authController');
const postController = require('../controllers/postController');
const validationResultHandler = require('../middlewares/validationResultHandler');
const setTheUserID = require('../middlewares/setIdParam');

const router = express.Router();

router
  .route('/')
  .get(postController.getAllPosts)
  .post(
    [check('text', 'Text is required').not().isEmpty()],
    validationResultHandler(validationResult),
    authController.protect,
    setTheUserID,
    postController.createPost
  );
router.route('/me').get(authController.protect, postController.getAllPosts);

router
  .route('/update/:id')
  .patch(authController.protect, postController.updateMyPost);

router
  .route('/:id')
  .get(postController.getOnePost)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    postController.updatePost
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    postController.deletePost
  );
module.exports = router;
