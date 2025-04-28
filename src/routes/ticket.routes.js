const express = require('express');
const router = express.Router();
const controllers = require('../controllers/ticket.controllers');
const verifyToken = require('../middlewares/verifyToken');
const authorizedRole = require('../middlewares/authorizedRole');
const userRoles = require('../config/userRoles.config');
const { createTicketValidation, deleteTicketsValidation, singleTicketValidation, updateTicketValidation } = require('../middlewares/ticketValidationSchema');

router.use(verifyToken)

router.route('/').get(
  authorizedRole(userRoles.ADMIN, userRoles.MANAGER),
  controllers.getAllTickets
).delete(
  authorizedRole(userRoles.ADMIN, userRoles.MANAGER),
  deleteTicketsValidation(),
  controllers.deleteTickets
)

router.route('/create').post(
  authorizedRole(userRoles.ADMIN, userRoles.MANAGER),
  createTicketValidation(),
  controllers.createTicket
)

router.route('/:ticketId').get(
  authorizedRole(userRoles.ADMIN, userRoles.MANAGER),
  singleTicketValidation(),
  controllers.getSingleTicket
).patch(
  authorizedRole(userRoles.ADMIN, userRoles.MANAGER),
  updateTicketValidation(),
  controllers.updateTicket
).delete(
  authorizedRole(userRoles.ADMIN),
  singleTicketValidation(),
  controllers.deleteTicket
)

module.exports = router