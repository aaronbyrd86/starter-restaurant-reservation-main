import React, { useEffect, useState, useCallback } from "react";
import {
  listReservations,
  listTables,
  finishTablesAndReservations,
  updateReservationStatus,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "../reservations/Reservation";
import Table from "../tables/Table";
import { today, previous, next } from "../utils/date-time";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const [updateReservationStatusError, setUpdateReservationStatusError] = useState(null);
  const [tables, setTables] = useState([]);

  const useQuery = () => new URLSearchParams(useLocation().search);
  let query = useQuery();
  const [currentDate, setCurrentDate] = useState(query.get("date") ?? today());

  useEffect(() => {
    if (query.get("date")) {
      setCurrentDate(query.get("date"));
    }
  }, [query]);

  const loadDashboard = useCallback(() => {
    const abortController = new AbortController();
    setReservationsError(null);

    listReservations({ date: currentDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables(abortController.signal).then(setTables).catch(setTablesError);

    return () => abortController.abort();
  }, [currentDate]);

  useEffect(() => {
    loadDashboard();
  }, [ currentDate, loadDashboard]);

  async function finishHandler(table_id) {
    const abortController = new AbortController();
    const text =
      "Is this table ready to seat new guests? This cannot be undone.";
	
	
	// return true if the user clicked OK and  then perform API request 
	// else return false so nothing happens 
    if (window.confirm(text)) {
      try {
        await finishTablesAndReservations(table_id, abortController.signal);
        try {
          const tablesResponse = await listTables(abortController.signal);
          setTables(tablesResponse);
          const reservationsResponse = await listReservations({
            date: currentDate,
          });
          console.log("Finish handler list reservations", reservationsResponse);
          setReservations(reservationsResponse);
        } catch (listError) {
          setReservationsError(listError);
        }
      } catch (finishError) {
        console.error(finishError);
      }
      return true;
    }

    return false;
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
          listReservations({ date: currentDate }, abortController.signal)
            .then(setReservations)
            .catch(setReservationsError)
        )
        .catch(setUpdateReservationStatusError);

      return true;
    }

    return false;
  }

  function showPrevDay() {
    const yesterday = previous(currentDate);
    setCurrentDate(yesterday);
  }

  function showNextDay() {
    const tommorow = next(currentDate);
    setCurrentDate(tommorow);
  }

  function showToday() {
    setCurrentDate(today());
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {currentDate}</h4>
      </div>
      <div className="reservations-div">
        {reservations.map((reservation, index) => (
          <Reservation
            key={index}
            reservation={reservation}
            cancelHandler={cancelReservationHandler}
          />
        ))}
      </div>
      <h4 className="mb-0">Tables</h4>
      <div className="tables-div">
        {tables.map((table, index) => (
          <Table key={index} table={table} finishHandler={finishHandler} />
        ))}
      </div>
      <div>
        <button onClick={showPrevDay}>Previous</button>
        <button onClick={showToday}>Today</button>
        <button onClick={showNextDay}>Next</button>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <ErrorAlert error={updateReservationStatusError} />
    </main>
  );
}

export default Dashboard;
