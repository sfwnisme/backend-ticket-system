const Comment = require('../models/comment.model')
const { formatApiResponse } = require('../utils/response');
const statusText = require('../config/statusText.config.js')
const AppError = require('../utils/appError.js')
const asyncWrapper = require('../middlewares/asyncWrapper.js')
const { validationResult } = require('express-validator');
const Ticket = require('../models/ticket.model.js');
const enumConfig = require('../config/enum.config.js');
const appError = new AppError()

const COMMENT_POPULATE_CONFIG = [
  { path: 'author', select: '_id name' },
  { path: 'ticket', select: '_id title' },
]

let commentController = module.exports

commentController.getAllComments = asyncWrapper(
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

commentController.getSingleComment = asyncWrapper(
  async (req, res, next) => {
    const { commentId } = req.params
    const errors = validationResult(req)

    const comment = await Comment.findById(commentId, { '__v': false }).lean()
    if (!errors.isEmpty()) {
      appError.create(400, statusText.FAIL, errors.array())
      return next(appError)
    }

    res.status(200).json(formatApiResponse(200, statusText.SUCCESS, "operation success", comment))
  }
)

commentController.createComment = asyncWrapper(
  async (req, res, next) => {
    const { content, ticket, isSolution } = req.body
    const currentUser = req.user._id
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      appError.create(400, statusText.FAIL, errors.array())
      return next(appError)
    }
    const comment = new Comment({
      content,
      ticket,
      author: currentUser,
      isSolution: isSolution || false
    })
    await comment.save()

    // update ticket to align with comments time creation
    await Ticket.findByIdAndUpdate(comment.ticket, { updatedAt: Date.now() })
    await Ticket.findByIdAndUpdate(comment.ticket,
      { $set: { status:  enumConfig.ticketStatus.IN_PROGRESS } },
      {
        $currentDate: { updateAt: true },
        where: { status: enumConfig.ticketStatus.OPEN }
      }
    )

    const populatedComment = await Comment.findById(comment._id)
      .populate(COMMENT_POPULATE_CONFIG).lean()

    res.status(201).json(formatApiResponse(201, statusText.SUCCESS, 'the comment created successfully', populatedComment))
  }
)

// get comments by ticket id


commentController.updateComment = asyncWrapper(
  async (req, res, next) => {
    const { body: { content, isSolution }, params: { commentId } } = req;
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      appError.create(400, statusText.FAIL, errors.array())
      return next(appError)
    }

    const updatedComment = await Comment.updateOne({ _id: commentId }, { content, isSolution }, { runValidators: true })
    const populatedComment = await Comment.findById(commentId).populate(COMMENT_POPULATE_CONFIG).lean()
    res.status(200).json(formatApiResponse(200, statusText.SUCCESS, "operation success", populatedComment))
  }
)


commentController.deleteComment = asyncWrapper(
  async (req, res, next) => {
    const { commentId } = req.params
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      appError.create(400, statusText.FAIL, errors.array())
      return next(appError)
    }

    // const deletedComment = await Comment.findByIdAndDelete(commentId)
    const deletedComment = await Comment.deleteOne({ _id: commentId })
    return res.status(200).json(formatApiResponse(200, statusText.SUCCESS, 'comment deleted successfully', deletedComment))
  }
)

commentController.deleteComments = asyncWrapper(
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

// module.exports = {
//   getAllComments,
//   getSingleComment,
//   createComment,
//   updateComment,
//   deleteComment,
//   deleteComments,
// }