const Ticket = require('../models/ticket.model')
const Comment = require('../models/comment.model')
const { formatApiResponse } = require('../utils/response');
const statusText = require('../config/statusText.config.js')
const AppError = require('../utils/appError.js')
const asyncWrapper = require('../middlewares/asyncWrapper.js')
const { validationResult } = require('express-validator')
const appError = new AppError()

const ticketControllers = module.exports

const TICKET_POPULATE_CONFIG = [
  { path: 'createdBy', select: '_id name' },
  { path: 'assignedTo', select: '_id name' },
  { path: 'tags', select: '_id name color' },
  { path: 'department', select: '_id title' },
]

ticketControllers.getAllTickets = asyncWrapper(
  async (req, res) => {
    const { departmentId, status, priority } = req.query
    let filter = {}
    if (departmentId) filter.department = departmentId
    if (status) filter.status = status
    if (priority) filter.priority = priority
    const allTickets = await Ticket.find(filter, { '__v': false })
      .populate(TICKET_POPULATE_CONFIG).lean()
    res.status(200).json(
      formatApiResponse(
        200,
        statusText.SUCCESS,
        'data fetched successfully',
        allTickets
      ))
  }
)

ticketControllers.getSingleTicket = asyncWrapper(
  async (req, res, next) => {
    const { ticketId } = req.params
    const errors = validationResult(req)

    const ticket = await Ticket.findOne({ _id: ticketId }, { '__v': false })
      .populate(TICKET_POPULATE_CONFIG).lean()
    if (!errors.isEmpty()) {
      appError.create(400, statusText.FAIL, errors.array())
      return next(appError)
    }

    res.status(200).json(formatApiResponse(200, statusText.SUCCESS, "operation success", ticket))
  }
)

ticketControllers.createTicket = asyncWrapper(
  async (req, res, next) => {
    const { body } = req
    const currentUser = req.user
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      appError.create(400, statusText.FAIL, errors.array())
      return next(appError)
    }

    const createdTicket = new Ticket({ ...body, createdBy: currentUser._id })
    await createdTicket.save()
    const populatedTicket = await Ticket.findById(createdTicket._id)
      .populate(TICKET_POPULATE_CONFIG)

    res.status(201).json(formatApiResponse(201, statusText.SUCCESS, 'The ticket created successfully', populatedTicket))
  }
)


ticketControllers.updateTicket = asyncWrapper(
  async (req, res, next) => {
    const { body, params: { ticketId } } = req;
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      appError.create(400, statusText.FAIL, errors.array())
      return next(appError)
    }

    const updatedTicket = await Ticket.updateOne({ _id: ticketId }, { ...body }, { runValidators: true })
    const populatedTicket = await Ticket.findById(ticketId)
    res.status(200).json(formatApiResponse(200, statusText.SUCCESS, "operation success", populatedTicket))
  }
)


ticketControllers.deleteTicket = asyncWrapper(
  async (req, res, next) => {
    const { ticketId } = req.params
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      appError.create(400, statusText.FAIL, errors.array())
      return next(appError)
    }

    const deletedTicket = await Ticket.deleteOne({ _id: ticketId })
    const deleteTicketComments = await Comment.deleteMany({ ticket: ticketId })
    return res.status(200).json(formatApiResponse(200, statusText.SUCCESS, 'ticket deleted successfully', deletedTicket))
  }
)

ticketControllers.deleteTickets = asyncWrapper(
  async (req, res, next) => {
    const { ticketIds } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      appError.create(400, statusText.FAIL, errors.array())
      return next(appError)
    }
    const deletedTickets = await Ticket.deleteMany({ _id: { $in: ticketIds } })
    return res.status(200).json(formatApiResponse(200, statusText.SUCCESS, 'delete successfully', deletedTickets))
  }
)

// module.exports = {
//   getAllTickets,
//   getSingleTicket,
//   createTicket,
//   updateTicket,
//   deleteTicket,
//   deleteTickets,
// }