const express = require('express');
const router = express.Router();
const controllers = require('../controllers/tag.controllers');
const { createTagValidation, updateTagValidation, deleteTagValidation } = require('../middlewares/tagValidationSchema');
const verifyToken = require('../middlewares/verifyToken');
const authorizedRole = require('../middlewares/authorizedRole');
const userRoles = require('../config/userRoles.config')

router.use(verifyToken)

router.route('/')
  .get(
    authorizedRole(...Object.values(userRoles)),
    controllers.getAllTags
  )
router.route('/create')
  .post(
    authorizedRole(userRoles.ADMIN, userRoles.MANAGER, userRoles.CSR),
    createTagValidation(),
    controllers.createTag
  )

router.route('/:tagId')
  .get(
    authorizedRole(...Object.values(userRoles)),
    controllers.getSingleTag
  )
  .patch(
    authorizedRole(userRoles.ADMIN, userRoles.MANAGER, userRoles.CSR),
    updateTagValidation(),
    controllers.updateTag
  )
  .delete(
    authorizedRole(userRoles.ADMIN, userRoles.MANAGER, userRoles.CSR),
    deleteTagValidation(),
    controllers.deleteTag
  )

module.exports = router