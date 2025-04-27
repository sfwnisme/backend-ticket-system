const Comment = require('../models/comment.model')
const { formatApiResponse } = require('../utils/response');
const statusText = require('../config/statusText.config.js')
const AppError = require('../utils/appError.js')
const asyncWrapper = require('../middlewares/asyncWrapper.js')
const { validationResult } = require('express-validator');
const Ticket = require('../models/ticket.model.js');
const appError = new AppError()

const COMMENT_POPULATE_CONFIG = [
  { path: 'author', select: '_id name' },
  { path: 'ticket', select: '_id title' },
]

const getAllComments = asyncWrapper(
  async (req, res) => {
    const filter = req.query?.ticketId ? { ticket: req.query.ticketId } : {}
    const allComments = await Comment.find(filter, { '__v': false })
      .populate(COMMENT_POPULATE_CONFIG)



    res.status(200).json(
      formatApiResponse(
        200,
        statusText.SUCCESS,
        'data fetched successfully',
        allComments
      ))
  }
)

const getSingleComment = asyncWrapper(
  async (req, res, next) => {
    const { commentId } = req.params
    const errors = validationResult(req)

    const comment = await Comment.findOne({ _id: commentId }, { '__v': false })
    if (!errors.isEmpty()) {
      appError.create(400, statusText.FAIL, errors.array())
      return next(appError)
    }

    res.status(200).json(formatApiResponse(200, statusText.SUCCESS, "operation success", comment))
  }
)

const createComment = asyncWrapper(
  async (req, res, next) => {
    const { content, ticket, author, isSolution } = req.body
    // const commentCreatedBy = req.body.user
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      appError.create(400, statusText.FAIL, errors.array())
      return next(appError)
    }
    const comment = new Comment({
      content,
      ticket,
      author,
      isSolution: isSolution || false
    })
    await comment.save()

    // update ticket to align with comments time creation
    await Ticket.findByIdAndUpdate(comment.ticket, { updatedAt: Date.now() })

    const populatedComment = await Comment.findById(comment._id)
      .populate(COMMENT_POPULATE_CONFIG).lean()

    res.status(201).json(formatApiResponse(201, statusText.SUCCESS, 'the comment created successfully', populatedComment))
  }
)

// get comments by ticket id


const updateComment = asyncWrapper(
  async (req, res, next) => {
    const { body, params: { commentId } } = req;
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      appError.create(400, statusText.FAIL, errors.array())
      return next(appError)
    }

    const updatedComment = await Comment.updateOne({ _id: commentId }, { ...body }, { runValidators: true })
    res.status(200).json(formatApiResponse(200, statusText.SUCCESS, "operation success", updatedComment))
  }
)


const deleteComment = asyncWrapper(
  async (req, res, next) => {
    const { commentId } = req.params
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      appError.create(400, statusText.FAIL, errors.array())
      return next(appError)
    }

    const deletedComment = await Comment.deleteOne({ _id: commentId })
    return res.status(200).json(formatApiResponse(200, statusText.SUCCESS, 'comment deleted successfully', deletedComment))
  }
)

const deleteComments = asyncWrapper(
  async (req, res, next) => {
    const { commentIds } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      appError.create(400, statusText.FAIL, errors.array())
      return next(appError)
    }
    const deletedComments = await Comment.deleteMany({ _id: { $in: commentIds } })
    return res.status(200).json(formatApiResponse(200, statusText.SUCCESS, 'delete successfully', deletedComments))
  }
)

module.exports = {
  getAllComments,
  getSingleComment,
  createComment,
  updateComment,
  deleteComment,
  deleteComments,
}