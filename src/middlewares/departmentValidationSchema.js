const { param, body } = require("express-validator");
const Ticket = require("../models/ticket.model");
const Department = require("../models/department.model");
const { checkExistDoc, checkInvalidObjectIds, checkDuplicatedDocs, optionalField, checkTakenDoc } = require("../utils/validation.utils");

const departmentValidationSchema = module.exports;

departmentValidationSchema.createDepartmentValidation = () => {
	return [
		body("title")
			.notEmpty()
			.withMessage("EMPTY_INPUT: department can not be emtpy")
			.isLength({ min: 5 })
			.withMessage((value) => `TOO_SHORT:"${value}" department title must be lest than 5 characters`)
			.custom(async (value) => await checkTakenDoc(value, Department, 'title', 'department')),
		optionalField("descriptoin")
			.isLength({ min: 20, max: 300 })
			.withMessage("TOO_SHORT: Description must be 20-300 characters"),
		optionalField("tickets")
			.isArray({ min: 1 })
			.custom(checkInvalidObjectIds)
			.custom(async (value) => await checkExistDoc(value, Ticket, 'ticket'))
			.custom(async (value) => await checkDuplicatedDocs(value, Ticket, 'ticket'))
	];
};


departmentValidationSchema.singleDepartmentValidation = () => {
	return [
		param("departmentId")
			.isMongoId()
			.withMessage((value) => `INVALID_ID: "${value}" is not a valid ID`)
			.custom(async (value) => checkExistDoc(value, Department, 'department'))
	];
};

departmentValidationSchema.updateDepartmentValidation = () => {
	return [
		...departmentValidationSchema.singleDepartmentValidation(),
		optionalField("title")
			.notEmpty()
			.withMessage("EMPTY_INPUT: department can not be emtpy")
			.isLength({ min: 5 })
			.withMessage((value) => `TOO_SHORT:"${value}" department title must be lest than 5 characters`)
			.custom(async (value) => await checkTakenDoc(value, Department, 'title', 'department')),
		optionalField("descriptoin")
			.isLength({ min: 20, max: 300 })
			.withMessage("TOO_SHORT: Description must be 20-300 characters"),
		optionalField("tickets")
			.isArray({ min: 1 })
			.custom(checkInvalidObjectIds)
			.custom(async (value) => await checkExistDoc(value, Ticket, 'ticket'))
			.custom(async (value) => await checkDuplicatedDocs(value, Ticket, 'ticket'))
	];
};
