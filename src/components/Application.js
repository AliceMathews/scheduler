import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/Appointment/index";

import { getAppointmentsForDay } from "helpers/selectors";

export default function Application(props) {
  // const [day, setDay] = useState("Monday");
  // const [days, setDays] = useState([]);

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  useEffect(() => {
    Promise.all([axios.get("/api/days"), axios.get("/api/appointments")])
      .then(([resDays, resAppointments]) => {
        setState(prev => ({
          days: resDays.data,
          appointments: resAppointments.data
        }));
      })
      .catch(err => console.log);
  }, []);

  const setDay = day => setState(prev => ({ ...prev, day }));

  const appointments = getAppointmentsForDay(state, state.day);

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointments.map(appointment => {
          return <Appointment key={appointment.id} {...appointment} />;
        })}
        <Appointment key="last" time="6pm" />
      </section>
    </main>
  );
}
