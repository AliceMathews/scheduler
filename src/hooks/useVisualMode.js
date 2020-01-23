import { useState } from "react";

export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);

  function transition(newMode, replace) {
    if (replace) {
      setHistory(prevHistory => [
        ...prevHistory.slice(0, prevHistory.length - 1),
        newMode
      ]);
    } else {
      setHistory(prevHistory => [...prevHistory, newMode]);
    }
    setMode(newMode);
  }

  function back() {
    if (history.length > 1) {
      const oldHistory = history.slice(0, history.length - 1);
      setMode(oldHistory[oldHistory.length - 1]);
      setHistory(prevHistory => prevHistory.slice(0, history.length - 1));
    }
  }

  return { mode, transition, back };
}
