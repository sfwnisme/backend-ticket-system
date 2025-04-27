const express = require('express');
const router = express.Router();
const controllers = require('../controllers/comment.controllers');
const { createCommentValidation, singleCommentValidation, updateCommentValidation } = require('../middlewares/commentValidationSchema');
const verifyToken = require('../middlewares/verifyToken');
const authorizedRole = require('../middlewares/authorizedRole');
const userRoles = require('../config/userRoles.config')

router.route('/')
  .get(verifyToken, authorizedRole(...Object.values(userRoles)), controllers.getAllComments)

router.route('/create')
  .post(createCommentValidation(), controllers.createComment)

router.route('/:commentId')
  .get(verifyToken, authorizedRole(...Object.values(userRoles)), singleCommentValidation(), controllers.getSingleComment)
  .patch(verifyToken, authorizedRole(userRoles.ADMIN, userRoles.MANAGER, userRoles.CSR), updateCommentValidation(), controllers.updateComment)
  .delete(verifyToken, authorizedRole(userRoles.ADMIN), singleCommentValidation(), controllers.deleteComment)

module.exports = router