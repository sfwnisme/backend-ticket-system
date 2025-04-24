const express = require('express');
const router = express.Router();
const controllers = require('../controllers/tag.controllers');
const { createTagValidation, updateTagValidation, deleteTagValidation } = require('../middlewares/tagValidationSchema');
const verifyToken = require('../middlewares/verifyToken');
const authorizedRole = require('../middlewares/authorizedRole');
const userRoles = require('../config/userRoles.config')

router.route('/')
  .get(verifyToken, authorizedRole(userRoles.ADMIN, userRoles.MANAGER), controllers.getAllTags)
router.route('/create')
  .post(createTagValidation(), controllers.createTag)

router.route('/:tagId')
  .get(verifyToken, authorizedRole(userRoles.ADMIN, userRoles.MANAGER), controllers.getSingleTag)
  .patch(verifyToken, authorizedRole(userRoles.ADMIN, userRoles.MANAGER), updateTagValidation(), controllers.updateTag)
  .delete(verifyToken, authorizedRole(userRoles.ADMIN), deleteTagValidation(), controllers.deleteTag)

module.exports = router