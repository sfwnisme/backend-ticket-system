const express = require('express');
const router = express.Router();
const controllers = require('../controllers/ticket.controllers');
const verifyToken = require('../middlewares/verifyToken');
const authorizedRole = require('../middlewares/authorizedRole');
const userRoles = require('../config/userRoles.config');
const { createTicketValidation, deleteTicketsValidation } = require('../middlewares/ticketValidationSchema');

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
  controllers.getSingleTicket
).patch(
  verifyToken,
  authorizedRole(userRoles.ADMIN, userRoles.MANAGER),
  controllers.updateTicket
).delete(
  verifyToken,
  authorizedRole(userRoles.ADMIN),
  controllers.deleteTicket
)

module.exports = router