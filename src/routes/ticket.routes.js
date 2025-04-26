const express = require('express');
const router = express.Router();
const controllers = require('../controllers/ticket.controllers');
const verifyToken = require('../middlewares/verifyToken');
const authorizedRole = require('../middlewares/authorizedRole');
const userRoles = require('../config/userRoles.config');
const { createTicketValidation, deleteTicketsValidation, singleTicketValidation } = require('../middlewares/ticketValidationSchema');

router.route('/').get(
  verifyToken,
  authorizedRole(userRoles.ADMIN, userRoles.MANAGER),
  controllers.getAllTickets
).delete(
  verifyToken,
  authorizedRole(userRoles.ADMIN, userRoles.MANAGER),
  deleteTicketsValidation(),
  controllers.deleteTickets
)

router.route('/create').post(
  verifyToken,
  authorizedRole(userRoles.ADMIN, userRoles.MANAGER),
  createTicketValidation(),
  controllers.createTicket
)

router.route('/:ticketId').get(
  verifyToken,
  authorizedRole(userRoles.ADMIN, userRoles.MANAGER),
  singleTicketValidation(),
  controllers.getSingleTicket
).patch(
  verifyToken,
  authorizedRole(userRoles.ADMIN, userRoles.MANAGER),
  controllers.updateTicket
).delete(
  verifyToken,
  authorizedRole(userRoles.ADMIN),
  singleTicketValidation(),
  controllers.deleteTicket
)

module.exports = router