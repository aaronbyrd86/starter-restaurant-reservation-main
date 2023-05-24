import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable, readReservation } from "../utils/api";
import { listTables } from "../utils/api";

function ReservationSeat() {
  const history = useHistory();
  const reservation_id = useParams().reservation_id;

  const initialFormState = "";

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState();

  useEffect(() => {
    const abortController = new AbortController();

    listTables(abortController.signal).then(setTables);
    readReservation(reservation_id, abortController.signal).then(setReservation);
  }, [reservation_id]);

  console.log(reservation);

  const handleChange = ({ target }) => {
    console.log(`target.value is: ${target.value}`);
    setFormData(target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const numPeople = reservation.people;

    console.log(numPeople);

    // console.log("Submitted:", formData);

    // setFormData({ ...initialFormState });

    // createTable(formData)
    //   .then(() => {
    //     history.push("/");
    //   })
    //   .catch(setError);
  };

  function cancelHandler() {
    history.goBack();
  }


  return (
    <div>
      <ErrorAlert error={error} />
      <h2>Seating reservation {reservation_id}</h2>
      <form>
        <div className="form-group">
          <label for="table_id">Please select a table</label>
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
          onClick={submitHandler}
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
