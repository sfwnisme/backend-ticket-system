const Tag = require('../models/tag.model')
const { formatApiResponse } = require('../utils/response');
const statusText = require('../config/statusText.config.js')
const AppError = require('../utils/appError.js')
const asyncWrapper = require('../middlewares/asyncWrapper.js')
const { validationResult } = require('express-validator')
const appError = new AppError()

const getAllTags = asyncWrapper(
  async (req, res) => {
    const allTags = await Tag.find({}, { '__v': false })
    res.status(200).json(
      formatApiResponse(
        200,
        statusText.SUCCESS,
        'data fetched successfully',
        allTags
      ))
  }
)

const getSingleTag = asyncWrapper(
  async (req, res, next) => {
    const { tagId } = req.params
    const errors = validationResult(req)
    const tag = await Tag.findOne({ _id: tagId }, { '__v': false })
    if (!tag) {
      appError.create(400, statusText.FAIL, "The requested tag doesn't exist. Kindly try another one.")
      return next(appError)
    }

    if (!errors.isEmpty()) {
      appError.create(400, statusText.FAIL, errors.array())
      return next(appError)
    }

    res.status(200).json(formatApiResponse(200, statusText.SUCCESS, "operation success", tag))
  }
)

const createTag = asyncWrapper(
  async (req, res, next) => {
    const { name, color = '#6c757d' } = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      appError.create(400, statusText.FAIL, errors.array())
      return next(appError)
    }
    const createdTag = new Tag({ name, color })
    await createdTag.save()
    res.status(201).json(formatApiResponse(201, statusText.SUCCESS, 'the tag created successfully', createdTag))
  }
)


const updateTag = asyncWrapper(
  async (req, res, next) => {
    const { body, params: { tagId } } = req;
    const errors = validationResult(req)
    const tag = await Tag.findOne({ _id: tagId });

    if (!tag) {
      appError.create(404, statusText.FAIL, `Tag [ ${tagId} ] is not exist`)
      return next(appError)
    }

    if (!errors.isEmpty()) {
      appError.create(400, statusText.FAIL, errors.array())
      return next(appError)
    }

    const updatedTag = await Tag.updateOne({ _id: tagId }, { ...body }, { runValidators: true })
    res.status(200).json(formatApiResponse(200, statusText.SUCCESS, "operation success", updatedTag))
  }
)


const deleteTag = asyncWrapper(
  async (req, res, next) => {
    const { tagId } = req.params
    const errors = validationResult(req)
    const tag = await Tag.findOne({ _id: tagId })
    console.log(tag)
    if (!tag) {
      appError.create(404, statusText.FAIL, `Tag [ ${tagId} ] is not exist`)
      return next(appError)
    }

    if (!errors.isEmpty()) {
      appError.create(400, statusText.FAIL, errors.array())
      return next(appError)
    }

    const deletedTag = await Tag.deleteOne({ _id: tagId })
    return res.status(200).json(formatApiResponse(200, statusText.SUCCESS, 'delete successfully', deletedTag))
  }
)

const deleteTags = asyncWrapper(
  async (req, res) => {
    const { tagIds } = req.body
    if (tagIds.length === 0 || !Array.isArray(tagIds)) {
      res.status(401).json(formatApiResponse(401, statusText.FAIL, "no tag ids exist"))
    }
    const deletedTags = await Tag.deleteMany({ _id: { $in: tagIds } })
    return res.status(200).json(formatApiResponse(200, statusText.SUCCESS, 'delete successfully', deletedTags))
  }
)

module.exports = {
  getAllTags,
  getSingleTag,
  createTag,
  updateTag,
  deleteTag,
  deleteTags,
}