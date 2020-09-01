const express = require('express');
const { check, validationResult } = require('express-validator');
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');
const validationResultHandler = require('../middlewares/validationResultHandler');
const setTheUserID = require('../middlewares/setIdParam');

const router = express.Router();

// GET /profiles/github/:username
router.route('/github/:username').get(profileController.getGithubProfile);

// AUTHENTICATED ROUTES
router.use(authController.protect);

// [ GET | POST ] users/:userId/profiles
// [ GET | POST ] /profiles
router
  .route('/')
  .get(profileController.getAllProfiles)
  .post(setTheUserID, profileController.createProfile);

// GET /profiles/me
router
  .route('/me')
  .get(authController.protect, profileController.getAllProfiles);
// [ GET | POST | DELETE] /profiles/experience/(:id)
router.route('/experience').patch(
  [
    check('title', 'title is a required field').not().isEmpty(),
    check('company', 'company is a required field').not().isEmpty(),
    check('from', 'from date is a required field').not().isEmpty(),
  ],
  validationResultHandler(validationResult),

  profileController.addProfileExperience
);

router
  .route('/experience/:id')
  .delete(profileController.removeProfileExperience);

// [ GET | POST | DELETE] /profiles/education/(:id)
router.route('/education').patch(
  [
    check('school', 'school is a required field').not().isEmpty(),
    check('degree', 'degree is a required field').not().isEmpty(),
    check('from', 'from date is a required field').not().isEmpty(),
    check('fieldofstudy', 'field of study  is a required field')
      .not()
      .isEmpty(),
  ],
  validationResultHandler(validationResult),

  profileController.addProfileEducation
);

router.route('/education/:id').delete(profileController.removeProfileEducation);
// [ GET | POST ] /profiles/:id
router
  .route('/:id')
  .get(profileController.getOneProfile)
  .patch(profileController.updateProfile)
  .delete(profileController.deleteProfile);

module.exports = router;
