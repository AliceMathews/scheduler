import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/Appointment/index";

import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay
} from "helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
      .then(([resDays, resAppointments, resInterviewers]) => {
        setState(prev => ({
          days: resDays.data,
          appointments: resAppointments.data,
          interviewers: resInterviewers.data
        }));
      })
      .catch(err => console.log);
  }, []);

  const setDay = day => setState(prev => ({ ...prev, day }));

  const appointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);

  function bookInterview(id, interview) {
    // console.log("in application", id, interview);
    const appointmentCopy = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointmentsCopy = { ...state.appointments, [id]: appointmentCopy };

    return axios({
      url: `/api/appointments/${id}`,
      method: "PUT",
      data: { interview }
    })
      .then(res => {
        setState({ ...state, appointments: appointmentsCopy });
      })
      .catch(err => console.log);
  }

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
          const interview = getInterview(state, appointment.interview);

          return (
            <Appointment
              key={appointment.id}
              id={appointment.id}
              time={appointment.time}
              interview={interview}
              interviewers={interviewers}
              bookInterview={bookInterview}
            />
          );
        })}
        <Appointment key="last" time="6pm" />
      </section>
    </main>
  );
}
