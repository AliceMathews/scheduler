export default function reducer(state, action) {
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

  throw new Error(
    `Tried to reduce with unsupported action type: ${action.type}`
  );
}

function getDayFromAppointmentId(id, state) {
  const days = [...state.days];

  for (const day of days) {
    if (day.appointments.includes(id)) {
      return day.name;
    }
  }
}

export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";
export const SET_SPOTS = "SET_SPOTS";
