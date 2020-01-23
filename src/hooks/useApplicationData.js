import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
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

  function bookInterview(id, interview) {
    const appointmentCopy = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointmentsCopy = { ...state.appointments, [id]: appointmentCopy };

    return axios({
      url: `/api/appointments/${id}`,
      method: "PUT",
      data: { interview }
    }).then(res => {
      setState({ ...state, appointments: appointmentsCopy });
    });
  }

  function cancelInterview(id) {
    const interview = null;
    const appointmentCopy = {
      ...state.appointments[id],
      interview
    };

    const appointmentsCopy = { ...state.appointments, [id]: appointmentCopy };

    return axios({
      url: `/api/appointments/${id}`,
      method: "DELETE"
    }).then(res => {
      setState({ ...state, appointments: appointmentsCopy });
    });
  }

  return { state, setDay, bookInterview, cancelInterview };
}
