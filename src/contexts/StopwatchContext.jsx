import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const LS_KEY = "ff.stopwatch";

const defaultState = {
  isRunning: false,
  elapsedMs: 0,
  activeTask: null, // { id, title, tag, date }
};

const StopwatchContext = createContext({
  ...defaultState,
  start: (_task) => {},
  pause: () => {},
  resume: () => {},
  stop: () => {},
  reset: () => {},
  format: (_ms) => "00:00:00",
});

export const StopwatchProvider = ({ children }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [activeTask, setActiveTask] = useState(null);
  const rafRef = useRef(null);
  const lastTickRef = useRef(null);

  // Load from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed) {
          setIsRunning(Boolean(parsed.isRunning));
          setElapsedMs(Number(parsed.elapsedMs || 0));
          setActiveTask(parsed.activeTask || null);
          // if was running, keep it running
          if (parsed.isRunning) {
            lastTickRef.current = performance.now();
            rafRef.current = requestAnimationFrame(tick);
          }
        }
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on every meaningful change
  useEffect(() => {
    const payload = { isRunning, elapsedMs, activeTask };
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
  }, [isRunning, elapsedMs, activeTask]);

  const tick = (now) => {
    if (!isRunning) return;
    const last = lastTickRef.current || now;
    const delta = now - last;
    lastTickRef.current = now;
    setElapsedMs((ms) => ms + delta);
    rafRef.current = requestAnimationFrame(tick);
  };

  const start = (task) => {
    // task: { id, title, tag, date }
    setActiveTask(task);
    setElapsedMs(0);
    setIsRunning(true);
    lastTickRef.current = performance.now();
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  };

  const resume = () => {
    if (!activeTask || isRunning) return;
    setIsRunning(true);
    lastTickRef.current = performance.now();
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  };

  const pause = () => {
    setIsRunning(false);
    cancelAnimationFrame(rafRef.current);
  };

  const stop = () => {
    setIsRunning(false);
    cancelAnimationFrame(rafRef.current);
    // keep elapsed + activeTask in case you want to show a summary
  };

  const reset = () => {
    setIsRunning(false);
    cancelAnimationFrame(rafRef.current);
    setElapsedMs(0);
    setActiveTask(null);
  };

  const format = (ms) => {
    const m = String(Math.floor(ms / 60000)).padStart(2, "0");
    const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
    const cs = String(Math.floor((ms % 1000) / 10)).padStart(2, "0"); // centiseconds
    return `${m}:${s}:${cs}`;
  };

  const value = useMemo(
    () => ({ isRunning, elapsedMs, activeTask, start, pause, resume, stop, reset, format }),
    [isRunning, elapsedMs, activeTask]
  );

  return <StopwatchContext.Provider value={value}>{children}</StopwatchContext.Provider>;
};

export const useStopwatch = () => useContext(StopwatchContext);
