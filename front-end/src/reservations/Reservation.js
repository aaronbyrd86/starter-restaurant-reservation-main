import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function Reservation({ reservation }) {
  return (
    <div className="card">
      <div className="card-body">
        <h5>Reservation ID: {reservation.reservation_id}</h5>
        <p>
          {reservation.first_name} {reservation.last_name}
        </p>
        <p>Phone: {reservation.mobile_number}</p>
        <p>Date: {reservation.reservation_date}</p>
        <p>Time: {reservation.reservation_time}</p>
        <p>People: {reservation.people}</p>
        <Link to={`/reservations/${reservation.reservation_id}/seat`}><button>Seat</button></Link>
      </div>
    </div>
  );
}

export default Reservation;
