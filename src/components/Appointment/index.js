import React, { useEffect } from "react";
import "./styles.scss";

import useVisualMode from "hooks/useVisualMode";

import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR-SAVE";
  const ERROR_DELETE = "ERROR-DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  useEffect(() => {
    if (!props.interview && mode === SHOW) {
      transition(EMPTY);
    } else if (props.interview && mode === EMPTY) {
      transition(SHOW);
    }
  }, [props.interview, transition, mode]);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(err => transition(ERROR_SAVE, true));
  }

  function deleteApt() {
    transition(DELETING, true);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(err => transition(ERROR_DELETE, true));
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />

      {mode === EMPTY && (
        <Empty
          onAdd={() => {
            transition(CREATE);
          }}
        />
      )}
      {mode === SHOW && props.interview && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={(name, interviewer) => {
            save(name, interviewer);
          }}
          onCancel={() => {
            back();
          }}
        />
      )}
      {mode === EDIT && (
        <Form
          interviewers={props.interviewers}
          interviewer={props.interview.interviewer.id}
          name={props.interview.student}
          onSave={(name, interviewer) => {
            save(name, interviewer);
          }}
          onCancel={() => {
            back();
          }}
        />
      )}
      {mode === SAVING && <Status message={mode} />}
      {mode === DELETING && <Status message={mode} />}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you would like to delete?"
          onCancel={() => back()}
          onConfirm={() => deleteApt()}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error message="There was an issue saving" onClose={() => back()} />
      )}
      {mode === ERROR_DELETE && (
        <Error message="There was an issue deleting" onClose={() => back()} />
      )}
    </article>
  );
}
