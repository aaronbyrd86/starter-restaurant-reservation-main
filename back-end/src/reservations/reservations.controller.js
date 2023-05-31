const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
  // "status"
);

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "reservation_id",
  "created_at",
  "updated_at",
];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }

  next();
}

function inputIsValid(req, _res, next) {
  const { reservation_date, reservation_time, people, status, mobile_number } = req.body.data;
  const dateRegex = /^\d{4}\-\d{1,2}\-\d{1,2}$/;
  const timeRegex = /[0-9]{2}:[0-9]{2}/;
  const phoneRegex = /[0-9]{3}-[0-9]{3}-[0-9]{4}/;

  //status of a new reservation 'booked'
  if (status === "seated" || status === "finished") {
    return next({
      status: 400,
      message: `Status "${status}" is not valid`,
    });
  }

  if (!dateRegex.test(reservation_date)) {
    return next({
      status: 400,
      message: `reservation_date "${reservation_date}" is not a valid date`,
    });
  }

  if (!timeRegex.test(reservation_time)) {
    return next({
      status: 400,
      message: `reservation_time "${reservation_time}" is not a valid time`,
    });
  }

  if (!phoneRegex.test(mobile_number)) {
    return next({
      status: 400,
      message: `mobile_number "${mobile_number}" is not a valid number`,
    });
  }

  if (typeof people !== "number" || people === 0) {
    return next({
      status: 400,
      message: `people ${people} is not a valid number`,
    });
  }

  next();
}

function dateIsFuture(date) {
  const today = new Date();

  console.log("current time", today.getHours());
  console.log("reservation time", date.getHours());

  if (date.getTime() < today.getTime()) {
    return false;
  } else {
    return true;
  }
}

function hasValidDate(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const resDate = new Date(`${reservation_date}T${reservation_time}`);

  //const dateRegex = /^\d{4}\-\d{1,2}\-\d{1,2}$/
  if (resDate.getDay() === 2) {
    return next({
      status: 400,
      message: `Can't make reservation, restaurant is closed on Tuesday`,
    });
  }

  if (!dateIsFuture(resDate)) {
    return next({
      status: 400,
      message: `Can't make reservation, reservation must be in the future.`,
    });
  }

  next();
}

function isValidTime(req, res, next) {
  const { reservation_time } = req.body.data;
  const time = parseInt(reservation_time.split(":").join(""));

  const openTime = 1030;
  const lastTime = 2130;

  console.log("Comparing times =>", time, lastTime);

  if (time < openTime) {
    return next({
      status: 400,
      message: `Can't make reservation, restaurant is not open yet`,
    });
  }
  if (time > lastTime) {
    return next({
      status: 400,
      message: `Can't make reservation, restaurant closes in an hour`,
    });
  } else {
    next();
  }
}

function isValidStatus(req, res, next) {
  const { status } = req.body.data;

  //handle finished reservation
  if (res.locals.reservation.status === "finished") {
    return next({
      status: 400,
      message: "Can't update finished reservation",
    });
  }

  //handle unknown status
  if (
    status !== "booked" &&
    status !== "seated" &&
    status !== "finished" &&
    status !== "cancelled"
  ) {
    return next({
      status: 400,
      message: `${status} is invalid status. Must be booked, seated, or finished`,
    });
  }

  next();
}


async function reservationExists(req, res, next) {
  const reservation = await reservationsService.read(req.params.reservation_id);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }

  next({
    status: 404,
    message: `Reservation ${req.params.reservation_id} cannot be found.`,
  });
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  if (req.query.date) {
    const data = await reservationsService.listDate(req.query.date);
    res.json({ data });
  } else if (req.query.mobile_number) {
    const data = await reservationsService.listNumber(req.query.mobile_number);
    res.json({ data });
  } else {
    const data = await reservationsService.list();
    res.json({ data });
  }
}

function read(req, res, next) {
  data = res.locals.reservation;

  res.json({ data });
}

async function create(req, res, next) {
  const {
    data: {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
    },
  } = req.body;
  //manually sets status to booked
  const newReservation = {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status: "booked"
  };
  const newRecord = await reservationsService.create(newReservation);
  res.status(201).json({ data: newRecord });
}

async function updateStatus(req, res, next) {
  const { status } = req.body.data;

  const updatedReservation = {
    ...res.locals.reservation,
    status: status,
  };

  const updatedRecord = await reservationsService.update(updatedReservation);

  res.json({ data: updatedRecord[0] });
}

async function update(req, res, next) {
  const updatedReservation = {
    ...req.body.data,
  };

  const updatedRecord = await reservationsService.update(updatedReservation);

  res.json({ data: updatedRecord[0] });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), read],
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    inputIsValid,
    hasValidDate,
    isValidTime,
    asyncErrorBoundary(create),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    isValidStatus,
    asyncErrorBoundary(updateStatus),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    hasOnlyValidProperties,
    hasRequiredProperties,
    inputIsValid,
    hasValidDate,
    isValidTime,
    asyncErrorBoundary(update),
  ],
};
