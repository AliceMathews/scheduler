import { useState, useEffect } from "react";

export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);

  function transition(newMode, replace) {
    console.log("start transition", newMode, replace);

    if (replace) {
      setHistory(prevHistory => [
        ...prevHistory.slice(0, prevHistory.length - 1),
        newMode
      ]);
    } else {
      // const newHistory = [...history, newMode];
      setHistory(prevHistory => [...prevHistory, newMode]);
    }
    setMode(newMode);
  }

  function back() {
    console.log("SHOULD nOT GET");
    if (history.length > 1) {
      const oldHistory = history.slice(0, history.length - 1);
      setMode(oldHistory[oldHistory.length - 1]);
      setHistory(prevHistory => prevHistory.slice(0, history.length - 1));
    }
  }
  console.log("updated hist", history);

  return { mode, transition, back };
}
