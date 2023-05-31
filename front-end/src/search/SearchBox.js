import React, { useState } from "react";
import { listReservations, updateReservationStatus } from "../utils/api";
import Reservation from "../reservations/Reservation";
import ErrorAlert from "../layout/ErrorAlert";

function SearchBox() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [foundReservations, setFoundReservations] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const[updateReservationStatusError, setUpdateReservationStatusError] = useState(null);
  const[reservationsError, setReservationsError] = useState(null);

  const handleChange = ({ target }) => {
    setPhoneNumber(target.value);
  };

  function searchHandler(event) {
    const abortController = new AbortController();
    const mobile_number = phoneNumber;

    setSearchError(null);

    setFoundReservations([]);

    listReservations({ mobile_number }, abortController.signal)
      .then(setFoundReservations)
      .then(() => {
        setHasSearched(true);
      })
      .catch(setSearchError);

    return () => abortController.abort();
  }

  function cancelReservationHandler(reservation_id) {
    const abortController = new AbortController();
    const text =
      "Do you want to cancel this reservation? This cannot be undone.";

    setUpdateReservationStatusError(null);
    setReservationsError(null);

    if (window.confirm(text)) {
      updateReservationStatus(reservation_id, abortController.signal)
        .then(
          listReservations({ mobile_number: phoneNumber }, abortController.signal)
            .then(setFoundReservations)
            .catch(setReservationsError)
        )
        .catch(setUpdateReservationStatusError);

      return true;
    }

    return false;
  }

  return (
    <div>
      <ErrorAlert error={searchError} />
      <ErrorAlert error={updateReservationStatusError} />
      <ErrorAlert error={reservationsError} />
      <div className="input-group">
        <div className="form-outline">
          <label className="form-label" htmlFor="form1">
            <input
              placeholder="Enter a customer's phone number."
              name="mobile_number"
              type="tel"
              id="form1"
              className="form-control"
              onChange={handleChange}
              pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" required
            />
          </label>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={searchHandler}
        >
          Find
        </button>
      </div>
      {hasSearched && !foundReservations.length ? (
        <ErrorAlert error={{ message: "No reservations found" }} />
      ) : (
        ""
      )}
      <div className="reservations-div">
        {foundReservations.map((reservation, index) => (
          <Reservation key={index} reservation={reservation} cancelHandler={cancelReservationHandler}/>
        ))}
      </div>
    </div>
  );
}

export default SearchBox;
