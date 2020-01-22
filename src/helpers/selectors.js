export function getAppointmentsForDay(state, day) {
  const appointmentsArr =
    state.days.filter(el => el.name === day).map(el => el.appointments)[0] ||
    [];

  const appointments = appointmentsArr.map(el => state.appointments[el]);

  return appointments;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const interviewObj = { ...interview };

  interviewObj.interviewer = state.interviewers[interview.interviewer];

  return interviewObj;
}
