import React, { useState } from "react";
import { listReservations } from "../utils/api";
import Reservation from "../reservations/Reservation";
import ErrorAlert from "../layout/ErrorAlert";

function SearchBox() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [foundReservations, setFoundReservations] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleChange = ({ target }) => {
    setPhoneNumber(target.value);
  };

  function searchHandler(event) {
    const abortController = new AbortController();
    const mobile_number = phoneNumber;

    listReservations({ mobile_number }, abortController.signal)
      .then(setFoundReservations)
      .then(() => {
        setHasSearched(true);
      })
      .catch(setSearchError);

    return () => abortController.abort();
  }

  return (
    <div>
      <ErrorAlert error={searchError} />
      <div className="input-group">
        <div className="form-outline">
          <label className="form-label" htmlFor="form1">
            <input
              placeholder="Enter a customer's phone number."
              name="mobile_number"
              type="search"
              id="form1"
              className="form-control"
              onChange={handleChange}
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
          <Reservation key={index} reservation={reservation} />
        ))}
      </div>
    </div>
  );
}

export default SearchBox;
