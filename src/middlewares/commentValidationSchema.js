const { param, body } = require("express-validator")
const Ticket = require("../models/ticket.model")
const User = require("../models/user.model")
const Comment = require("../models/comment.model")

function optionalField(fieldName, ...validations) {
  return body(fieldName).optional(...validations)
}
const commentValidationSchema = module.exports

commentValidationSchema.createCommentValidation = () => {
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
        const ticket = await Ticket.findById(value).select('_id').lean()
        if (!ticket) {
          throw new Error("NOT_FOUND")
        }
        return true
      })
      .withMessage((value) => `"${value}" ticket ID not found`),
    body("author")
      .optional()
      .custom((value, { req }) => {
        console.log('valdiation', value)
        if (value) {
          throw new Error('UNACCEPTED_REQUEST: Author field is a server-managed')
        }
        if (!req.user) {
          throw new Error('UNAUTHENTICATED: You are not authenticated')
        }
        return true
      }),
    optionalField('isSolution')
      .notEmpty()
      .isBoolean()
      .withMessage((value) => `"${value}" must be boolean`)
  ]
}

commentValidationSchema.singleCommentValidation = () => {
  return [
    param('commentId')
      .isMongoId()
      .withMessage((value) => `"${value}" is not a valid ID`)
      .custom(async (value) => {
        const comment = await Comment.findById(value).lean()
        if (!comment) {
          throw new Error('NOT_FOUND: comment not found')
        }
        return true
      })
      .withMessage((value) => `"${value}" comment not found`)
  ]
}

commentValidationSchema.updateCommentValidation = () => {
  return [
    param('commentId')
      .notEmpty()
      .withMessage("Comment Id can not be empty")
      .isMongoId()
      .withMessage((value) => `"${value}" is not a valid ID`)
      .custom(async (value, { req }) => {
        // const user = await User.findOne({ _id: req.user._id })
        const currentUser = req.user
        const comment = await Comment.findById(value).lean()
        if (!comment) {
          throw new Error('COMMENT_NOT_FOUND')
        }
        if (!currentUser) {
          throw new Error("USER_NOT_FOUND")
        }
        console.log("#############", currentUser._id, comment.author)
        if (String(currentUser._id) !== String(comment.author)) {
          throw new Error('You are not the author')
        }
        return true
      }),
    optionalField('content')
      .notEmpty()
      .withMessage("comment can not be emtpy")
      .isLength({ min: 3 })
      .withMessage((value) => `"${value}" comment can not be lest than 3 characters`),
    optionalField('ticket')
      .not().exists().withMessage('can not upadte ticket')
      .custom(async (value) => {
        const ticket = await Ticket.findById(value).select('_id').lean()
        if (!ticket) {
          throw new Error("NOT_FOUND")
        }
        return true
      })
      .withMessage((value) => `"${value}" ticket ID not found`),
    optionalField('isSolution')
      .notEmpty()
      .isBoolean()
      .withMessage((value) => `"${value}" must be boolean`)
  ]
}
