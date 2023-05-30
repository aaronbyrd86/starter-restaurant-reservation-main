const tablesService = require("./tables.service");
const reservationsService = require("../reservations/reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties("table_name", "capacity");

const VALID_PROPERTIES = ["table_name", "capacity", "reservation_id"];

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

function validateFields(req, res, next) {
  const { table_name, capacity } = req.body.data;

  if (table_name.length <= 1) {
    return next({
      status: 400,
      message: `table_name data is invalid`,
    });
  }

  if (capacity < 1 || typeof capacity !== "number") {
    return next({
      status: 400,
      message: `capacity data is invalid`,
    });
  }

  next();
}

async function tableExists(req, res, next) {
  const table = await tablesService.read(req.params.tableId);

  if (table) {
    res.locals.table = table;
    return next();
  }

  next({ status: 404, message: `Table ${req.params.tableId} cannot be found.` });
}

async function validateUpdateData(req, res, next) { 

  console.log(Object.keys(req.body).includes("data"))

  if(!Object.keys(req.body).includes("data"))
    return next({ status: 400, message: `Missing data property.` });

  const reservation_id = req.body.data.reservation_id;  
  
  ///data is missing
  if(!reservation_id) {
    return next({
      status: 400,
      message: "reservation_id"
    })
  }
  console.log("reservation_id", reservation_id);
  const reservation = await reservationsService.read(reservation_id)

  ///reservation_id does not exist
  if(!reservation) {
    return next({
      status: 404,
      message: `reservation_id ${reservation_id} does not exist`
    })
  }

  //reservation is already seated
  if(Object.keys(reservation).includes("status")){
    if(reservation.status === "seated") {
      return next({
        status: 400,
        message: `Reservation ${reservation_id} is already seated`
      })
    }
  }

  //table does not have capacity
  const tableCap = res.locals.table.capacity;
  const reservationCap = reservation.people;

  if(reservationCap > tableCap) {
    return next({
      status: 400,
      message: `Table has insufficient capacity`
    })
  }

  //table is occupied
  if(res.locals.table.reservation_id) {
    return next({
      status: 400,
      message: `The table is already occupied`
    })
  }

  res.locals.reservation = reservation;

  next();
}


async function list(req, res, next) {
  const data = await tablesService.list();
  res.json({ data });
}

async function create(req, res, next) {
  const { data } = req.body;
  const newTable = data;

  const newRecord = await tablesService.create(newTable);

  res.status(201).json({ data: newRecord });
}

async function update(req, res, next) {
  const { reservation_id } = req.body.data;

  const updatedTable = {
    ...res.locals.table,
    reservation_id: reservation_id,
  };

  await tablesService.updateTablesAndReservations(updatedTable, reservation_id)
  res.status(200).json({ data: "update successful"});
}

async function destroy(req, res, next) {
  const reservation_id = res.locals.table.reservation_id;

  //table is not occupied
  if(!res.locals.table.reservation_id)
    return next({
      status: 400,
      message: `Table is not occupied`
    })

  await tablesService.finishTablesAndReservations(reservation_id);

  res.status(200).json({ data: "successfully finished reservation"});
}

module.exports = {
  list: asyncErrorBoundary(list),
  delete: [tableExists, asyncErrorBoundary(destroy)],
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    validateFields,
    asyncErrorBoundary(create),
  ],
  update: [tableExists, validateUpdateData, asyncErrorBoundary(update)],
};
