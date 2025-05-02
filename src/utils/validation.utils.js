const { body } = require("express-validator");
const { default: mongoose } = require("mongoose");

const validationUtils = module.exports

validationUtils.checkExistDoc = async (value, ModelName, docName) => {
  if (Array.isArray(value)) {
    const data = await ModelName.find({ _id: { $in: value } }).select('_id').lean();
    if (!data) {
      throw new Error(`NOT_FOUND: ${value} ${docName} not found`)
    }
  }
  const data = await ModelName.findById(value).lean();
  if (!data) {
    throw new Error(`NOT_FOUND: ${value} ${docName} not found`)
  }
  return true
}

// valid object id
validationUtils.checkInvalidObjectIds = (objectIdsArray) => {
  const invalidObjectIds = objectIdsArray.filter((objectId) => !mongoose.Types.ObjectId.isValid(objectId))
  if (invalidObjectIds.length > 0) {
    throw new Error(`INVALID_OBJECTID: ${invalidObjectIds} not valid object id`)
  }
  return true
}
// duplicated document
validationUtils.checkDuplicatedDocs = async (idsArray, ModelName, docName) => {
  const docs = await ModelName.find({ _id: { $in: idsArray } }).select('_id').lean()
  console.log('docs', docs)
  const uniqueDocs = [...new Set(docs.map((doc) => doc._id.toString()))]
  console.log('docs unique no Id', [...new Set(docs.map((doc) => doc.toString()))])
  console.log('docs unique selected Id', [...new Set(docs.map((doc) => doc._id.toString()))])
  const duplicatedDocs = idsArray.filter((id, idx) => uniqueDocs.indexOf(String(id)) !== idx)
  if (idsArray.length > uniqueDocs.length) {
    throw new Error(`DUPLICATED: ${duplicatedDocs.join(', ')} ${docName} is duplicated`)
  }
  return true
}
// taken value
validationUtils.checkTakenDoc = async (value, ModelName, field, docName) => {
  // const doc = await ModelName.findOne({ field: value }).select(field).lean()
  const query = { [field]: value }
  const doc = await ModelName.findOne(query).select(field).lean()
  if (doc) {
    throw new Error(`TAKEN_INPUT: ${value} ${docName} has already been taken`)
  }
  return true
}
// is array
validationUtils.checkValidArray = (value) => {
  if (!Array.isArray(value)) {
    throw new Error(`INVALID_INPUT: ${value} should be array`)
  }
  return true
}
// not empty array
validationUtils.checkEmtpyArray = (value) => {
  if (value.length === 0) {
    throw new Error(`EMPTY_INPUT: ${value} should not be empty`)
  }
  return true
}

validationUtils.optionalField = (fieldName, ...validations) => {
  return body(fieldName).optional(...validations);
}