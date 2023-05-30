import React, { useEffect, useState } from "react";


function Table({ table, finishHandler }) {
  const [occupied, setOccupied] = useState(false);
  const [finished, setFinished] = useState(false);

  async function changeText(){
    //update only if the user clicks OK in the window
    const confirmed = await finishHandler(table.table_id)
  
    if(confirmed){
      setFinished(true);
      setOccupied(false);
    } 
  }

  //change occupied state when the table's reservation_id is no longer null
  useEffect(() => {
    if(table.reservation_id){
       setOccupied(true);
       setFinished(false);
    }
  }, [table.reservation_id])

  return (
    <div className="card">
      <div className="card-body">
        <h5>Table ID: {table.table_id}</h5>
        <p>Table Name: {table.table_name}</p>
        {occupied ? (
          <p data-table-id-status={table.table_id}>occupied</p>
        ) : (
          <p data-table-id-status={table.table_id}>Free</p>
        )}
        {!finished && occupied ? (
          <button data-table-id-finish={table.table_id} onClick={changeText}>
            Finish
          </button>
        ) : (
          <p />
        )}
      </div>
    </div>
  );
}

export default Table;
