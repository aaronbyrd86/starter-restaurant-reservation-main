import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "../reservations/Reservation";
import Table from "../tables/Table";
import { useLocation } from "react-router-dom";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [currentDate, setCurrentDate] = useState(date);
  const today = date;

  const useQuery = () => new URLSearchParams(useLocation().search);

  let query = useQuery();

  console.log(query.get('date'));

  if(query.get('date'))
    date = query.get('date');
  
  

  useEffect(() => {
    setCurrentDate(date);
    loadDashboard()
  }
  , [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    // console.log(`current date is ${currentDate}`)
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
 
    return () => abortController.abort();
  }


  // console.log(currentDate);
  function showPrevDay(){
    const d = new Date(currentDate);
    console.log(d)
    const yesterday = new Date(d.getTime() - (24 * 60 * 60 * 1000));
    console.log(yesterday);
    setCurrentDate(yesterday);
  }

  function showNextDay(){
    const d = new Date(currentDate);
    console.log(d)
    const tomorrow = new Date(d.getTime() + (24 * 60 * 60 * 1000));
    console.log(tomorrow);
    setCurrentDate(tomorrow);
  }

  function showToday(){
    console.log(`today is ${today}`)
    date = today;
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <div className="reservations-div">
        {reservations.map((reservation, index) => <Reservation key={index} reservation={reservation}/>)}
      </div>
      <h4 className="mb-0">Tables</h4>
      <div className="tables-div">
        {tables.map((table, index) => <Table key={index} table={table}/>)}
      </div>
      <div>
        <button onClick={showPrevDay}>Previous</button>
        <button onClick={showToday}>Today</button>
        <button onClick={showNextDay}>Next</button>
      </div>
      <ErrorAlert error={reservationsError} />
    </main>
  );
}

export default Dashboard;
