const express = require('express');
const router = express.Router();
const controllers = require('../controllers/ticket.controllers');
const verifyToken = require('../middlewares/verifyToken');
const authorizedRole = require('../middlewares/authorizedRole');
const userRoles = require('../config/userRoles.config');
const { createTicketValidation, deleteTicketsValidation, singleTicketValidation, updateTicketValidation } = require('../middlewares/ticketValidationSchema');

router.use(verifyToken)

router.route('/').get(
  authorizedRole(...Object.values(userRoles)),
  controllers.getAllTickets
).delete(
  authorizedRole(userRoles.ADMIN),
  deleteTicketsValidation(),
  controllers.deleteTickets
)

router.route('/create').post(
  authorizedRole(userRoles.ADMIN, userRoles.MANAGER, userRoles.CSR),
  createTicketValidation(),
  controllers.createTicket
)

router.route('/:ticketId').get(
  authorizedRole(...Object.values(userRoles)),
  singleTicketValidation(),
  controllers.getSingleTicket
).patch(
  authorizedRole(userRoles.ADMIN, userRoles.MANAGER, userRoles.CSR),
  updateTicketValidation(),
  controllers.updateTicket
).delete(
  authorizedRole(userRoles.ADMIN),
  singleTicketValidation(),
  controllers.deleteTicket
)

module.exports = router