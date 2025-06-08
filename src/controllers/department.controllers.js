const Department = require("../models/department.model");
const { formatApiResponse } = require("../utils/response");
const statusText = require("../config/statusText.config.js");
const AppError = require("../utils/appError.js");
const asyncWrapper = require("../middlewares/asyncWrapper.js");
const { validationResult } = require("express-validator");
const Ticket = require("../models/ticket.model.js");
const appError = new AppError();


let departmentController = module.exports;

departmentController.getAllDepartments = asyncWrapper(async (req, res) => {
  const allDepartments = await Department.find({}, { __v: false })
  console.log(allDepartments)
  res
    .status(200)
    .json(
      formatApiResponse(
        200,
        statusText.SUCCESS,
        "data fetched successfully",
        allDepartments,
      ),
    );
});

departmentController.getSingleDepartment = asyncWrapper(
  async (req, res, next) => {
    const { departmentId } = req.params;
    const errors = validationResult(req);

    const department = await Department.findById(departmentId, { "__v": false }).lean();
    if (!errors.isEmpty()) {
      appError.create(400, statusText.FAIL, errors.array());
      return next(appError);
    }

    res
      .status(200)
      .json(
        formatApiResponse(
          200,
          statusText.SUCCESS,
          "operation success",
          department,
        ),
      );
  },
);

departmentController.createDepartment = asyncWrapper(async (req, res, next) => {
  const { body } = req;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    appError.create(400, statusText.FAIL, errors.array());
    return next(appError);
  }
  const department = new Department(body);
  await department.save();

  // await Ticket.updateMany(department.tickets, { updatedAt: Date.now() });

  const populatedDepartment = await Department.findById(department._id)
    .lean()
    // .populate(DEPARTMENT_POPULATE_CONFIG)

  res
    .status(201)
    .json(
      formatApiResponse(
        201,
        statusText.SUCCESS,
        "the department created successfully",
        populatedDepartment,
      ),
    );
});

departmentController.updateDepartment = asyncWrapper(async (req, res, next) => {
  const {
    body,
    params: { departmentId },
  } = req;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    appError.create(400, statusText.FAIL, errors.array());
    return next(appError);
  }

  const updatedDepartment = await Department.updateOne(
    { _id: departmentId },
    { ...body },
  );
  const department = await Department.findById(departmentId).lean();
  //   .populate(DEPARTMENT_POPULATE_CONFIG)
  res
    .status(200)
    .json(
      formatApiResponse(
        200,
        statusText.SUCCESS,
        "operation success",
        department,
      ),
    );
});

departmentController.deleteDepartment = asyncWrapper(async (req, res, next) => {
  const { departmentId } = req.params;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    appError.create(400, statusText.FAIL, errors.array());
    return next(appError);
  }

  const deletedDepartment = await Department.findOneAndDelete({ _id: departmentId });
  return res
    .status(200)
    .json(
      formatApiResponse(
        200,
        statusText.SUCCESS,
        "department deleted successfully",
        deletedDepartment,
      ),
    );
});

departmentController.addTicketToDepartment = asyncWrapper(
  async (req, res, next) => {
    const { departmentId, ticketId } = req.body;
    const errors = validationResult(req)
    const department = await Department.findById(departmentId);
    const findDepartment = await Department.findByIdAndUpdate(departmentId, {
      ticket: department.tickets.push(ticketId),
    }).lean();

    if (!errors.isEmpty()) {
      appError.create(400, statusText.FAIL, errors.array());
      return next(appError)
    }
    return res.status(200).json(formatApiResponse(
      200,
      statusText.SUCCESS,
      'successfully data fetched',
      findDepartment
    ))
  },
);
