import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ErrorAlert from "../layout/ErrorAlert";
import { readReservation, updateTablesAndReservations } from "../utils/api";
import { listTables } from "../utils/api";

function ReservationSeat() {
  const history = useHistory();
  const reservation_id = useParams().reservation_id;

  const [formData, setFormData] = useState("");
  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState();

  useEffect(() => {
    const abortController = new AbortController();

    async function loadData(){
      const tablesResponse = await listTables(abortController.signal);
      setTables(tablesResponse);

      const reservationResponse = await readReservation(reservation_id, abortController.signal);
      setReservation(reservationResponse);
    }
    loadData()
    // listTables(abortController.signal).then(setTables);
    // readReservation(reservation_id, abortController.signal).then(setReservation);

  }, [reservation_id]);


  const handleChange = ({ target }) => {
    console.log(`target.value is: ${target.value}`);
    setFormData(target.value);
  };


  async function submitHandler(event) {
    event.preventDefault();

    const abortController = new AbortController();
    setError(null);

    const table_id = formData;
    console.log("Seating table ID: ", table_id)

    try {
      await updateTablesAndReservations(table_id, reservation_id,abortController.signal)
      history.push(`/reservations?date=${reservation.reservation_date}`);
    } catch(error) {
      setError(error)
    } 

    console.log("Submitted:", formData);
  }

  function cancelHandler() {
    history.goBack();
  }


  return (
    <div>
      <ErrorAlert error={error} />
      <h2>Seating reservation {reservation_id}</h2>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="table_id">Please select a table</label>
          <select
            id="table_id"
            name="table_id"
            onChange={handleChange}
            value={formData}
          >
            <option value="">-- Select an Option --</option>
            {tables.map((table, index) => (
              <option value={table.table_id} key={index}>
                {table.table_name} - {table.capacity}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
        >
          Submit
        </button>
        <button type="button" onClick={cancelHandler}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default ReservationSeat;
