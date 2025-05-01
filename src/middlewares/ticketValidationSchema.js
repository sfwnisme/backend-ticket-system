const { body, param } = require("express-validator")
const Ticket = require("../models/ticket.model")
const enumConfig = require("../config/enum.config")
const Users = require("../models/user.model")
const Tag = require("../models/tag.model")
const { default: mongoose } = require("mongoose")

// function optionalField(fieldName, ...validations) {
//   return body(fieldName).optional(...validations)
// }

async function notTicketFound(value) {
  const res = await Ticket.findOne({ title: value })
  if (res) {
    throw new Error(`"${value}" {model} name is already taken, choose another one`)
  }
  return true
}

async function ticketFound(value) {
  const res = await Ticket.findOne({ title: value })
  if (res) {
    throw new Error(`"${value}" ${value} name is already taken, choose another one`)
  }
  return true
}

const ticketValidationSchema = module.exports

ticketValidationSchema.singleTicketValidation = () => {
  return [
    param('ticketId')
      .isMongoId()
      .withMessage((value) => `"${value}" Invalid ticket ID format`)
      .custom(async (value) => {
        const ticket = await Ticket.findOne({ _id: value })
        if (!ticket) {
          throw new Error("NOT_EXIST")
        }
        return true
      })
      .withMessage((value) => `"${value}" ticket is not exist`)
  ]
}
ticketValidationSchema.createTicketValidation = () => {
  return [
    body('title')
      .notEmpty()
      .withMessage("Ticket cannot be empty")
      .isLength({ min: 15, max: 120 })
      .withMessage((value) => `"${value}" ticket name length should contain 15 to 120 charachters`)
      .custom(async (value) => {
        const ticket = await Ticket.findOne({ title: value })
        console.log('tickt=========', ticket)
        if (ticket) {
          throw new Error(`"${value}" ticket name is already taken, choose another one`)
        }
        return true
      })
      .withMessage((value) => `"${value}" ticket name is already taken, choose another one`),
    body('description')
      .notEmpty()
      .withMessage("description can not be empty")
      .isLength({ min: 15 })
      .withMessage((value) => `"${value}" ticket name length should contain 15 to 120 charachters`),
    body('status')
      .optional(),
    body('priority')
      .optional()
      .isIn(Object.values(enumConfig.ticketPriority))
      .withMessage((value) => `priority should be one of the following "${value}"`),
    body('createdBy')
      .optional(),
    body('assignedTo')
      .optional()
      .custom(async (value) => {
        const user = await Users.findOne({ _id: value })
        if (!user) {
          throw new Error('USER_NOT_EXIST')
        }
        return true
      })
      .withMessage((value) => `"${value}" user is not exist`),
    body('department')
      .optional() /* check then after creating deparment routes*/,
    body('tags')
      .optional()
      .isArray({ min: 1 })
      .withMessage('Tags must provided as a non-empty array')
      .bail()
      .custom((tags) => {
        // check invalid ID
        const invalidIds = tags.filter((tag) => !mongoose.Types.ObjectId.isValid(tag))
        if (invalidIds.length > 0) {
          throw new Error("NOT_VALID_ID: " + invalidIds.join(', '))
        }
        return true
      })
      .bail()
      .custom(async (tags = []) => {
        // check existing tags
        const existingTags = await Tag.find({ _id: { $in: tags } }).select('_id').lean()
        console.log('existingTags', existingTags)
        const existingTagIds = existingTags.map((t) => t._id.toString()) // to array
        const missingTagIds = tags.filter((id) => !existingTagIds.includes(id))
        console.log(missingTagIds)
        if (missingTagIds.length > 0) {
          throw new Error('TAG_NOT_EXIST: ' + missingTagIds.join(', '))
        }
        return true
      })
      .custom((tags = []) => {
        // check duplicates
        const uniqueTags = [...new Set(tags.map(tag => tag.toString()))];
        console.log('tags', tags)
        if (uniqueTags.length !== tags.length) {
          const duplicates = tags.filter((tag, index) => uniqueTags.indexOf(tag) !== index);
          console.log("duplicates", duplicates)
          throw new Error('DUPLICATE_TAGS: ' + duplicates.join(', '));
        }
        return true;
      }),
    body('dueDate')
      .optional()
  ]
}

ticketValidationSchema.updateTicketValidation = () => {
  return [
    body('title')
      .optional()
      .isLength({ min: 15, max: 120 })
      .withMessage((value) => `"${value}" ticket name length should contain 15 to 120 charachters`)
      .custom(async (value) => {
        const ticket = await Ticket.findOne({ title: value })
        console.log('tickt=========', ticket)
        if (ticket) {
          throw new Error(`"${value}" ticket name is already taken, choose another one`)
        }
        return true
      })
      .withMessage((value) => `"${value}" ticket name is already taken, choose another one`),
    body('description')
      .optional()
      .isLength({ min: 15 })
      .withMessage((value) => `"${value}" ticket name length should contain 15 to 120 charachters`),
    body('status').optional(),
    body('priority')
      .optional()
      .isIn(Object.values(enumConfig.ticketPriority))
      .withMessage((value) => `priority should be one of the following "${value}"`),
    body('createdBy').optional(),
    body('assignedTo')
      .optional()
      .custom(async (value) => {
        const user = await Users.findOne({ _id: value })
        if (!user) {
          throw new Error('USER_NOT_EXIST')
        }
        return true
      })
      .withMessage((value) => `"${value}" user is not exist`),
    body('department').optional(),
    body('tags')
      .optional()
      .isArray({ min: 1 })
      .withMessage('Tags must provided as a non-empty array')
      .bail()
      .custom((tags) => {
        // check invalid ID
        const invalidIds = tags.filter((tag) => !mongoose.Types.ObjectId.isValid(tag))
        if (invalidIds.length > 0) {
          throw new Error("NOT_VALID_ID: " + invalidIds.join(', '))
        }
        return true
      })
      .bail()
      .custom(async (tags = []) => {
        // check existing tags
        const existingTags = await Tag.find({ _id: { $in: tags } }).select('_id').lean()
        console.log('existingTags', existingTags)
        const existingTagIds = existingTags.map((t) => t._id.toString()) // to array
        const missingTagIds = tags.filter((id) => !existingTagIds.includes(id))
        console.log(missingTagIds)
        if (missingTagIds.length > 0) {
          throw new Error('TAG_NOT_EXIST: ' + missingTagIds.join(', '))
        }
        return true
      })
      .custom((tags = []) => {
        // check duplicates
        const uniqueTags = [...new Set(tags.map(tag => tag.toString()))];
        if (uniqueTags.length !== tags.length) {
          const duplicates = tags.filter((tag, index) => tags.indexOf(tag) !== index);
          throw new Error('DUPLICATE_TAGS: ' + duplicates.join(', '));
        }
        return true;
      }),
    body('dueDate').optional()
  ]
}

ticketValidationSchema.deleteTicketsValidation = () => {
  return [
    body('ticketIds')
      .isArray({ min: 11 })
      .withMessage('Must provide an array with ticket ID')
      .custom((value) => {
        const invalidObjectId = value.filter(id => !mongoose.Types.ObjectId.isValid(id))
        if (invalidObjectId.length > 0) {
          throw new Error('INVALID_TICKET_ID')
        }
        return true
      })
      .withMessage(`One or more ticket IDs is Invalid ID format`),
  ]
}
