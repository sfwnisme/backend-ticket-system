const { body, param } = require("express-validator")
const Ticket = require("../models/ticket.model")
const enumConfig = require("../config/enum.config")
const Users = require("../models/user.model")
const Tag = require("../models/tag.model")
const { default: mongoose } = require("mongoose")

function optionalField(fieldName, ...validations) {
  return body(fieldName).optional(...validations)
}

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

const singleTicketValidation = () => {
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
const createTicketValidation = () => {
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
      .custom(async (value) => {
        const tag = await Tag.findOne({ _id: value })
        if (!tag) {
          throw new Error('TAG_NOT_EXIST')
        }
        return true
      })
      .withMessage((value) => `"${value}" tag is not exist`),
    body('dueDate')
      .optional()
  ]
}

const updateTicketValidation = () => {
  return [
    optionalField('title')
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
    optionalField('description')
      .isLength({ min: 15 })
      .withMessage((value) => `"${value}" ticket name length should contain 15 to 120 charachters`),
    optionalField('status'),
    optionalField('priority')
      .isIn(Object.values(enumConfig.ticketPriority))
      .withMessage((value) => `priority should be one of the following "${value}"`),
    optionalField('createdBy'),
    optionalField('assignedTo')
      .custom(async (value) => {
        const user = await Users.findOne({ _id: value })
        if (!user) {
          throw new Error('USER_NOT_EXIST')
        }
        return true
      })
      .withMessage((value) => `"${value}" user is not exist`),
    optionalField('department'),
    optionalField('tags')
      .custom(async (value) => {
        const tag = await Tag.findOne({ _id: value })
        if (!tag) {
          throw new Error('TAG_NOT_EXIST')
        }
        return true
      })
      .withMessage((value) => `"${value}" tag is not exist`),
    optionalField('dueDate')
  ]
}

const deleteTicketsValidation = () => {
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

module.exports = { singleTicketValidation, createTicketValidation, updateTicketValidation, deleteTicketsValidation }
