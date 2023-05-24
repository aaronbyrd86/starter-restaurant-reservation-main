import React, { useEffect, useState } from "react";
import { useParams, useRouteMatch, Link } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";

function ReservationForm() {
  const params = useParams();
  const { path } = useRouteMatch();
  const history = useHistory();
  

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "123-456-7890",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [error, setError] = useState(null)

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();

    console.log("Submitted:", formData);

    setFormData({ ...initialFormState });

    createReservation(formData)
        .then(() => {
            history.push({
                pathname: '/',
                search: `?date=${formData.reservation_date}`,
              })
        })
        .catch(setError)
  };

  function cancelHandler(){
    history.push("/");
  }

  return (
    <div>
    <ErrorAlert error={error} />
    <h2>Create Reservation</h2>
    <form>
      <div className="form-group">
        <label htmlFor="first_name">First Name</label>
        <input
          onChange={handleChange}
          type="text"
          name="first_name"
          value={formData.first_name}
        />
      </div>
      <div className="form-group">
        <label htmlFor="last_name">
          Last Name
          
        </label>
        <input
            onChange={handleChange}
            type="text"
            name="last_name"
            value={formData.last_name}
          />
      </div>
      <div className="form-group">
        <label htmlFor="mobile_number">
          Mobile Number
         
        </label>
         <input
            onChange={handleChange}
            type="text"
            name="mobile_number"
            value={formData.mobile_number}
          />
      </div>
      <div className="form-group">
        <label htmlFor="reservation_date">
          Reservation Date
          
        </label>
        <input
            onChange={handleChange}
            type="date"
            name="reservation_date"
            value={formData.reservation_date}
          />
      </div>
      <div className="form-group">
        <label htmlFor="reservation_time">
          Reservation Time
          
        </label>
        <input
            onChange={handleChange}
            type="time"
            name="reservation_time"
            value={formData.reservation_time}
          />
      </div>

      <div className="form-group">
        <label htmlFor="people">
          People
          
        </label>
        <input
            onChange={handleChange}
            type="text"
            name="people"
            value={formData.people}
          />
      </div>

      <button type="submit" onClick={submitHandler} className="btn btn-primary">
        Submit
      </button>
      <button type="button" onClick={cancelHandler}>Cancel</button>
    </form>
    </div>
  );
}

export default ReservationForm;
