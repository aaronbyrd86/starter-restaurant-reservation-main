import React, { useEffect, useState } from "react";

function Reservation({ reservation, cancelHandler }) {

  const [status, setStatus] = useState(reservation.status);
  const [cancelled, setCancelled] = useState(false)

  useEffect(() => {
    setStatus(reservation.status)
    if(reservation.status === "cancelled")
      setCancelled(true);
  }, [reservation.status])

  function setToCanceled(){
    
    if(cancelHandler(reservation.reservation_id)){
      setCancelled(!cancelled);
      setStatus("cancelled");
    }
  }

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
        <p data-reservation-id-status={reservation.reservation_id}>Current status: {status}</p>
        { status === "booked" ? (<a href={`/reservations/${reservation.reservation_id}/seat`}><button type="submit">Seat</button></a>) :(<p></p>) }
        { status === "booked" ? (<a href={`/reservations/${reservation.reservation_id}/edit`}><button>Edit</button></a>) :(<p></p>) }
        { cancelled || reservation.status === "finished"
        ? <p></p>
        : <button onClick={setToCanceled} data-reservation-id-cancel={reservation.reservation_id}>Cancel</button> 
        }
      </div>
    </div>
  );
}

export default Reservation;
