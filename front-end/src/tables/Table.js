import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function Table({ table }) {
  return (
    <div className="card">
      <div className="card-body">
        <h5>Table ID: {table.table_id}</h5>
        <p>
          Table Name: {table.table_name}
        </p>
        {table.reservation_id ? <p>Occupied</p> : <p>Free</p>}
      </div>
    </div>
  );
}

export default Table;
