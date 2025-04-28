const express = require('express');
const router = express.Router();
const controllers = require('../controllers/comment.controllers');
const { createCommentValidation, singleCommentValidation, updateCommentValidation } = require('../middlewares/commentValidationSchema');
const verifyToken = require('../middlewares/verifyToken');
const authorizedRole = require('../middlewares/authorizedRole');
const userRoles = require('../config/userRoles.config')

router.use(verifyToken)

router.route('/')
  .get(authorizedRole(...Object.values(userRoles)), controllers.getAllComments)

router.route('/create')
  .post(createCommentValidation(), controllers.createComment)

router.route('/:commentId')
  .get(authorizedRole(...Object.values(userRoles)), singleCommentValidation(), controllers.getSingleComment)
  .patch(authorizedRole(userRoles.ADMIN, userRoles.MANAGER, userRoles.CSR), updateCommentValidation(), controllers.updateComment)
  .delete(authorizedRole(userRoles.ADMIN), singleCommentValidation(), controllers.deleteComment)

module.exports = router