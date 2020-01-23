import { useState, useEffect } from "react";

export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);

  function transition(newMode, replace) {
    setMode(newMode);

    if (replace) {
      console.log("in replace");
      const newHistory = [...history.slice(0, history.length - 1), newMode];
      // setHistory(newHistory);
      setHistory(prevHistory => [
        ...prevHistory.slice(0, history.length - 1),
        newMode
      ]);
    } else {
      const newHistory = [...history, newMode];
      setHistory(prevHistory => [...prevHistory, newMode]);
    }
  }

  function back() {
    if (history.length > 1) {
      const oldHistory = history.slice(0, history.length - 1);
      setMode(oldHistory[oldHistory.length - 1]);
      setHistory(prevHistory => prevHistory.slice(0, history.length - 1));
    }
  }
  console.log(history);

  return { mode, transition, back };
}
