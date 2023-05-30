const knex = require("../db/connection");

function list() {
  return knex("reservations").select("*").orderBy("reservation_time");
}


// function listDate(reservation_date) {
//     return knex("reservations")
//       .whereNot("status", "finished")
//       .orWhere("status", null)
//       .andWhere({ reservation_date })
//       .orderBy("reservation_time");
//   }

  function listDate(reservation_date) {
    return knex("reservations")
      .select("*")
      .where({ reservation_date })
      .andWhere("status", null)
      .orWhere({ reservation_date })
      .andWhereNot("status", "finished")
      .orderBy("reservation_time");
  }  

function listNumber(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function create(newReservation) {
  return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function read(reservation_id) {
  return knex("reservations").where({ reservation_id }).first();
}

function update(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*");
}

module.exports = {
  list,
  listDate,
  listNumber,
  create,
  read,
  update,
};
