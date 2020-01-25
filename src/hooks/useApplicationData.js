import { useEffect, useReducer } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_SPOTS = "SET_SPOTS";

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
      // interview: { ...action.value.interview }
      interview: action.value.interview
    };

    const appointmentsCopy = {
      ...state.appointments,
      [action.value.id]: appointmentCopy
    };

    return { ...state, appointments: appointmentsCopy };
  }

  if (action.type === SET_SPOTS) {
    const day = getDayFromAppointmentId(action.value.id, state);
    const dayArr = state.days.find(el => el.name === day).appointments;

    const spots = dayArr.reduce((accumulator, currentVal) => {
      if (state.appointments[currentVal].interview === null) {
        return accumulator + 1;
      } else {
        return accumulator;
      }
    }, 0);

    const newDays = state.days.map(el => {
      if (el.name === day) {
        return { ...el, spots };
      } else {
        return el;
      }
    });

    return { ...state, days: newDays };
  }
}

function getDayFromAppointmentId(id, state) {
  const days = [...state.days];

  for (const day of days) {
    if (day.appointments.includes(id)) {
      return day.name;
    }
  }
}

export default function useApplicationData() {
  const [state, dispatchState] = useReducer(reducer, initialState);

  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    webSocket.onopen = () => {
      webSocket.onmessage = event => {
        const data = JSON.parse(event.data);
        const value = { id: data.id, interview: data.interview };
        dispatchState({ type: SET_INTERVIEW, value });
        dispatchState({ type: SET_SPOTS, value });
      };
    };

    return () => webSocket.close();
  }, []);

  // useEffect(() => {
  //   dispatchState({ type: SET_SPOTS });

  // }, [state.appointments]);

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
      dispatchState({ type: SET_SPOTS, value });
    });
  }

  function cancelInterview(id) {
    const value = { id, interview: null };

    return axios({
      url: `/api/appointments/${id}`,
      method: "DELETE"
    }).then(res => {
      dispatchState({ type: SET_INTERVIEW, value });
      dispatchState({ type: SET_SPOTS, value });
    });
  }

  // function getDayFromAppointmentId(id) {
  //   const days = [...state.days];

  //   for (const day of days) {
  //     if (day.appointments.includes(id)) {
  //       return day.name;
  //     }
  //   }
  // }

  return { state, setDay, bookInterview, cancelInterview };
}
