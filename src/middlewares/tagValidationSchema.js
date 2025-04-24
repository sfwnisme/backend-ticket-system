const { body, param } = require("express-validator")
const Tag = require("../models/tag.model")

const createTagValidation = () => {
  return [
    body('name')
      .notEmpty()
      .withMessage("Tag name cannot be empty")
      .isLength({ min: 3, max: 20 })
      .withMessage((value) => `[ ${value} ] tag name length should contain 3 to 20 charachters`)
      .custom(async (value) => {
        const tag = await Tag.findOne({ name: value })
        if (tag) {
          throw new Error(`[ ${value} ] tag name is already taken`)
        }
        return true
      })
      .withMessage((value) => `[ ${value} ] tag name is already taken`)
    ,
    body('color')
      .optional()
      .isHexColor()
      .withMessage((value) => `[ ${value} ] is not a valid hex color`)
      .custom(async (value) => {
        const tag = await Tag.findOne({ color: value })
        if (tag) {
          throw new Error(`[ ${value} ] tag color is already taken`)
        }
        return true
      })
      .withMessage((value) => `[ ${value} ] tag color is already taken`)
  ]
}

const updateTagValidation = () => {
  return [
    param('tagId')
      .isMongoId()
      .withMessage((value) => `[ ${value} ] Invalid tag ID format`),
    body('name')
      .optional()
      .notEmpty()
      .withMessage("Tag name cannot be empty")
      .isLength({ min: 3, max: 20 })
      .withMessage((value) => `[ ${value} ] tag name length should contain 3 to 20 charachters`)
      .custom(async (value, { req }) => {
        const tag = await Tag.findOne({ name: value, _id: { $eq: req.params.tagId } })
        if (tag) throw new Error(`NO_CHANGE`)
      })
      .withMessage((value) => `[ ${value} ] is the same as current value`)
      .custom(async (value, { req }) => {
        const tag = await Tag.findOne({
          name: value,
          _id: { $ne: req.params.tagId }
        })
        if (tag) throw new Error(`DUPLICATE`)
        return true
      })
      .withMessage((value) => `[ ${value} ] tag name is already taken`)
    ,
    body('color')
      .optional()
      .notEmpty()
      .withMessage("Tag color could not be empty")
      .isHexColor()
      .withMessage((value) => `[ ${value} ] is not a valid hex color`)
      .custom(async (value, { req }) => {
        const tag = await Tag.findOne({ name: value, _id: { $eq: req.params.tagId } })
        if (tag) throw new Error(`NO_CHANGE`)
      })
      .withMessage((value) => `[ ${value} ] is the same as current value`)
      .custom(async (value, { req }) => {
        const tag = await Tag.findOne({ color: value, _id: { $ne: req.params.tagId } })
        if (tag) throw new Error(`DUPLICATE`)
        return true
      })
      .withMessage((value) => `[ ${value} ] tag color is already taken`)
  ]
}

const deleteTagValidation = () => {
  return [
    param('tagId')
      .isMongoId()
      .withMessage((value) => `[ ${value} ] Invalid tag ID format`),
  ]
}

module.exports = { createTagValidation, updateTagValidation, deleteTagValidation }

/** what should validation do?
 * NAME:
 * name should not be empty
 * name should be unique
 * name length 3 to 20 ch
 * COLOR:
 * color is optional
 * color is hex format
 * color should be unique
 * TEST: 🟩Passed
 * [x] new name with new color
 * [x] used name with new color
 * [x] used name with no color
 * [x] new name with no color
 * [x] new name with used color
 * [x] used name with used color 
 */