const express = require('express');
const router = express.Router();
const controllers = require('../controllers/department.controllers');
const { createDepartmentValidation, singleDepartmentValidation, updateDepartmentValidation } = require('../middlewares/departmentValidationSchema');
const verifyToken = require('../middlewares/verifyToken');
const authorizedRole = require('../middlewares/authorizedRole');
const userRoles = require('../config/userRoles.config')

router.use(verifyToken)

router.route('/')
  .get(authorizedRole(...Object.values(userRoles)), controllers.getAllDepartments)

router.route('/create')
  .post(createDepartmentValidation(), controllers.createDepartment)

router.route('/:departmentId')
  .get(authorizedRole(...Object.values(userRoles)), singleDepartmentValidation(), controllers.getSingleDepartment)
  .patch(authorizedRole(userRoles.ADMIN, userRoles.MANAGER, userRoles.CSR), updateDepartmentValidation(), controllers.updateDepartment)
  .delete(authorizedRole(userRoles.ADMIN), singleDepartmentValidation(), controllers.deleteDepartment)

module.exports = router