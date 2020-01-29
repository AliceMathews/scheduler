import { useEffect, useReducer } from "react";
import axios from "axios";
import reducer, {
  SET_DAY,
  SET_INTERVIEW,
  SET_SPOTS,
  SET_APPLICATION_DATA
} from "../reducers/application";

const initialState = {
  day: "Monday",
  days: [],
  appointments: {},
  interviewers: {}
};

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

    return axios.put(`/api/appointments/${id}`, { interview }).then(res => {
      dispatchState({ type: SET_INTERVIEW, value });
      dispatchState({ type: SET_SPOTS, value });
    });
  }

  function cancelInterview(id) {
    const value = { id, interview: null };

    return axios.delete(`/api/appointments/${id}`).then(res => {
      dispatchState({ type: SET_INTERVIEW, value });
      dispatchState({ type: SET_SPOTS, value });
    });
  }

  return { state, setDay, bookInterview, cancelInterview };
}
