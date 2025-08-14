import React from "react";
import { useStopwatch } from "../../contexts/StopwatchContext";
import { useAuth } from "../../contexts/AuthContext"; // assuming this exists in your project
import { Link } from "react-router-dom";
import useTypingEffect from "../../hooks/useTypingEffect";
import AppIcon from "../AppIcon";

const Greeting = ({ name }) => {
  const hour = new Date().getHours();
  const bucket = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const text = `${bucket}, ${name || "there"} 👋`;
  const typed = useTypingEffect(text, 25);
  return (
    <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
      {typed}
    </h1>
  );
};

const GlobalHeader = () => {
  const { user } = useAuth?.() || { user: { name: "User" } };
  const { isRunning, activeTask, elapsedMs, format, pause, resume, stop } = useStopwatch();

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <AppIcon className="h-6 w-6" />
            <span className="hidden sm:inline font-semibold">FocusFlow</span>
          </Link>
          <div className="pl-2 truncate">
            <Greeting name={user?.name} />
            {activeTask && (
              <p className="text-xs text-muted-foreground truncate">
                Tracking: <span className="font-medium">{activeTask.title}</span>
                {activeTask.tag ? <span className="ml-1">· #{activeTask.tag}</span> : null}
              </p>
            )}
          </div>
        </div>

        {/* Stopwatch */}
        <div className="flex items-center gap-2">
          {activeTask ? (
            <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full border border-border">
              <span className="font-mono text-sm tabular-nums">{format(elapsedMs)}</span>
              {isRunning ? (
                <button
                  className="text-xs px-2 py-1 rounded bg-amber-500/10 text-amber-700 hover:bg-amber-500/20"
                  onClick={pause}
                >
                  Pause
                </button>
              ) : (
                <button
                  className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20"
                  onClick={resume}
                >
                  Resume
                </button>
              )}
              <button
                className="text-xs px-2 py-1 rounded bg-rose-500/10 text-rose-700 hover:bg-rose-500/20"
                onClick={stop}
              >
                Stop
              </button>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">No active timer</div>
          )}

          {/* Profile */}
          <Link
            to="/settings"
            className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-border hover:ring-foreground/30 overflow-hidden"
            title="Profile"
          >
            <img
              src="https://i.pravatar.cc/64?img=68"
              alt="avatar"
              className="h-full w-full object-cover"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
