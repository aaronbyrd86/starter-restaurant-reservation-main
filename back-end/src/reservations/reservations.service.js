const knex = require("../db/connection");

function list() {
  return knex("reservations").select("*").orderBy("reservation_time");
}

function listDate(reservation_date) {
  return knex("reservations").where({ reservation_date }).orderBy("reservation_time");
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

// function destroy (review_id) {
//     return knex("reviews").where({ "review_id": review_id}).del();
// }

// function update (updatedReview) {
//     console.log(updatedReview)
//     return knex("reviews")
//     .where({ review_id: updatedReview.review_id })
//     .update(updatedReview, "*")
//     .then(()=>read(updatedReview.review_id))
//     .then(async review => {
//         const critic = await knex("critics").select("*").where({"critic_id": review.critic_id}).first()
//         review.critic = critic
//         return review;
//     })

// }

module.exports = {
  list,
  listDate,
  listNumber,
  create,
  read
};
