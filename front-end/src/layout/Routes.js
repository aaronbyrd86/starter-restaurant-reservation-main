import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import TableForm from "../tables/TableForm";
import ReservationSeat from "../reservations/ReservationSeat";
import SearchBox from "../search/SearchBox";
import EditReservation from "../reservations/EditReservation";
import CreateReservation from "../reservations/CreateReservation";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      
      <Route path="/dashboard">
        <Dashboard/>
      </Route>

      <Route path="/reservations/new">
        <CreateReservation />
      </Route>

      <Route path="/tables/new">
        <TableForm />
      </Route>
      
      <Route path="/reservations/:reservation_id/seat">
        <ReservationSeat />
      </Route>
      
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      
      <Route path="/search">
        <SearchBox />
      </Route>
      
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
