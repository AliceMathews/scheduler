import { useEffect, useReducer } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

const initialState = {
  day: "Monday",
  days: [],
  appointments: {},
  interviewers: {}
};

function reducer(state, action) {
  if (action.type === SET_DAY) {
    return { ...state, day: action.value };
  }

  if (action.type === SET_APPLICATION_DATA) {
    return {
      ...state,
      days: action.value.resDays.data,
      appointments: action.value.resAppointments.data,
      interviewers: action.value.resInterviewers.data
    };
  }

  if (action.type === SET_INTERVIEW) {
    const appointmentCopy = {
      ...state.appointments[action.value.id],
      interview: { ...action.value.interview }
    };

    const appointmentsCopy = {
      ...state.appointments,
      [action.value.id]: appointmentCopy
    };

    return { ...state, appointments: appointmentsCopy };
  }
}

export default function useApplicationData() {
  const [state, dispatchState] = useReducer(reducer, initialState);

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
      .then(([resDays, resAppointments, resInterviewers]) => {
        const value = { resDays, resAppointments, resInterviewers };
        dispatchState({ type: SET_APPLICATION_DATA, value });
      })
      .catch(err => console.log);
  }, []);

  const setDay = day => dispatchState({ type: SET_DAY, value: day });

  function bookInterview(id, interview) {
    const value = { id, interview };

    return axios({
      url: `/api/appointments/${id}`,
      method: "PUT",
      data: { interview }
    }).then(res => {
      dispatchState({ type: SET_INTERVIEW, value });
    });
  }

  function cancelInterview(id) {
    const value = { id };

    return axios({
      url: `/api/appointments/${id}`,
      method: "DELETE"
    }).then(res => {
      dispatchState({ type: SET_INTERVIEW, value });
    });
  }

  return { state, setDay, bookInterview, cancelInterview };
}
