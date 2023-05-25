const knex = require("../db/connection");


function list() {
    return knex("tables").select("*").orderBy("table_name");
}

function read(table_id){
    return knex("tables").where({ table_id}).first();
}

function create(newTable){
    return knex("tables")
        .insert(newTable)
        .returning("*")
        .then((createdRecords) => createdRecords[0]);
}

function update(updatedTable){
    return knex("tables")
        .select("*")
        .where({ table_id: updatedTable.table_id })
        .update(updatedTable, "*")
}

async function updateTablesAndReservations(updatedTable, reservation_id) {
    await knex.transaction(async (trx) => {
      const [table, reservation] = await Promise.all([
        trx('tables').select("*").where({ table_id: updatedTable.table_id}).update(updatedTable, "*"),
        trx('reservations').select("*").where({ reservation_id }).update({ status: "seated" }),
      ])
    })
  }

function destroy(reservation_id){
    return knex("tables").where({ reservation_id }).update("reservation_id", null);
}

async function finishTablesAndReservations(reservation_id) {
    await knex.transaction(async (trx) => {
      const [table, reservation] = await Promise.all([
        trx('tables').where({ reservation_id }).update("reservation_id", null),
        trx('reservations').where({ reservation_id }).update({ status: "finished" }),
      ])
    })
  }

module.exports = {
    list,
    read,
    create,
    update,
    destroy,
    updateTablesAndReservations,
    finishTablesAndReservations
}