const { param, body } = require("express-validator")
const Ticket = require("../models/ticket.model")
const User = require("../models/user.model")
const Comment = require("../models/comment.model")

/**
 * content, ticket, author, 
 */

function optionalField(fieldName, ...validations) {
  return body(fieldName).optional(...validations)
}

const createCommentValidation = () => {
  return [
    body('content')
      .notEmpty()
      .withMessage("comment can not be emtpy")
      .isLength({ min: 3 })
      .withMessage((value) => `"${value}" comment can not be lest than 3 characters`),
    body('ticket')
      .notEmpty()
      .withMessage('Ticket ID can not be empty')
      .custom(async (value) => {
        const ticket = await Ticket.findOne({ _id: value })
        if (!ticket) {
          throw new Error("NOT_FOUND")
        }
        return true
      })
      .withMessage((value) => `"${value}" ticket ID not found`),
    body('author')
      .notEmpty()
      .withMessage('Author can not be emtpy')
      .custom(async (value) => {
        const user = await User.findOne({ _id: value })
        if (!user) {
          throw new Error('NOT_FOUND')
        }
        return true
      })
      .withMessage((value) => `"${value}" author ID not found`),
    optionalField('isSolution')
      .isBoolean()
      .withMessage((value) => `"${value}" must be boolean`)
  ]
}

const singleCommentValidation = () => {
  return [
    param('commentId')
      .isMongoId()
      .withMessage((value) => `"${value}" is not a valid ID`)
      .custom(async () => {
        const comment = Comment.findOne({ _id: value })
        if (!comment) {
          throw new Error('NOT_FOUND')
        }
        return true
      })
      .withMessage((value) => `"${value}" comment not found`)
  ]
}

const updateCommentValidation = () => {
  return [
    param('commentId')
      .notEmpty()
      .withMessage("Comment Id can not be empty")
      .isMongoId()
      .withMessage((value) => `"${value}" is not a valid ID`)
      .custom(async (value, { req }) => {
        const user = await User.findOne({ _id: req.body.user._id })
        const comment = await Comment.findOnd({ _id: value })
        if (!comment) {
          throw new Error('COMMENT_NOT_FOUND')
        }
        if (!user) {
          throw new Error("USER_NOT_FOUND")
        }
        if (user._id !== comment.author) {
          throw new Error('You are not the author')
        }
        // if (!user._id === comment.author) {
        //   throw new Error('COMMENT_NOT_FOUND')
        // }
        return true
      }),
    optionalField('content')
      .notEmpty()
      .withMessage("comment can not be emtpy")
      .isLength({ min: 3 })
      .withMessage((value) => `"${value}" comment can not be lest than 3 characters`),
    body('ticket')
      .not().exists().withMessage('can not upadte ticket'),
    body('author')
      .not().exists().withMessage('can not upadte author'),
    optionalField('isSolution')
      .isBoolean()
      .withMessage((value) => `"${value}" must be boolean`)
  ]
}

module.exports = {
  createCommentValidation,
  updateCommentValidation,
  singleCommentValidation
}