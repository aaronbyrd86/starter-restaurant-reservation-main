import React from "react";

function ReservationForm({handleChange, submitHandler, cancelHandler, initialFormData }) {
  return (
    <div>
      <div>
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <input
              onChange={handleChange}
              type="text"
              name="first_name"
              value={initialFormData.first_name}
            />
          </div>
          <div className="form-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              onChange={handleChange}
              type="text"
              name="last_name"
              value={initialFormData.last_name}
            />
          </div>
          <div className="form-group">
            <label htmlFor="mobile_number">Mobile Number</label>
            <input
              onChange={handleChange}
              type="tel"
              name="mobile_number"
              value={initialFormData.mobile_number}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reservation_date">Reservation Date</label>
            <input
              onChange={handleChange}
              type="date"
              name="reservation_date"
              value={initialFormData.reservation_date}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reservation_time">Reservation Time</label>
            <input
              onChange={handleChange}
              type="time"
              name="reservation_time"
              value={initialFormData.reservation_time}
            />
          </div>

          <div className="form-group">
            <label htmlFor="people">People</label>
            <input
              onChange={handleChange}
              type="number"
              name="people"
              value={initialFormData.people}
            />
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
    </div>
  );
}

export default ReservationForm;
