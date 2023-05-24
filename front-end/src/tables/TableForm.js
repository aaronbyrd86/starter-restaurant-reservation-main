import React, { useEffect, useState } from "react";
import { useParams, useRouteMatch, Link } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

function TableForm() {
  const history = useHistory();

  const initialFormState = {
    table_name: "",
    capacity: 0,
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [error, setError] = useState(null);

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

    createTable(formData)
        .then(() => {
            history.push("/")
        })
        .catch(setError)
  };

  function cancelHandler(){
    history.push("/");
  }

  return (
    <div>
        <ErrorAlert error={error}/>
      <form>
        <div className="form-group">
          <label htmlFor="table_name">Table Name</label>
          <input
            onChange={handleChange}
            type="text"
            name="table_name"
            value={formData.table_name}
          />
        </div>
        <div className="form-group">
          <label htmlFor="capacity">Capacity</label>
          <input
            onChange={handleChange}
            type="text"
            name="capacity"
            value={formData.capacity}
          />
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

export default TableForm;
