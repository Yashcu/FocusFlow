import React, { useEffect, useMemo, useState } from "react";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";

const LS_TASKS = "ff.tasks";
const LS_TAGS = "ff.tags"; // used by Settings/TagManagement.jsx in your app (fallback if empty)

const readLS = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeLS = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

const todayISO = () => new Date().toISOString().slice(0, 10);

const TaskManager = ({ onTasksChange }) => {
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [date, setDate] = useState(todayISO());
  const [tasks, setTasks] = useState(() => readLS(LS_TASKS, []));

  const tags = useMemo(() => {
    const fromLS = readLS(LS_TAGS, []);
    // normalize into [{id?, name}]
    return Array.isArray(fromLS)
      ? fromLS.map((t) => (typeof t === "string" ? { name: t } : t))
      : [];
  }, []);

  useEffect(() => {
    writeLS(LS_TASKS, tasks);
    onTasksChange?.(tasks);
  }, [tasks, onTasksChange]);

  const addTask = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const newTask = {
      id: crypto.randomUUID?.() || Date.now(),
      title: trimmed,
      tag: tag || null,
      date,
      status: "todo",
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
    setTitle("");
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const upcoming = useMemo(
    () => tasks.slice(0, 5), // small preview under the form
    [tasks]
  );

  return (
    <div className="bg-card rounded-xl border border-border p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base sm:text-lg font-semibold">Task Manager</h2>
        <span className="text-xs text-muted-foreground">Plan tasks for today or future</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6">
          <Input
            placeholder="Task title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Task title"
          />
        </div>
        <div className="sm:col-span-3">
          <Select value={tag} onChange={(e) => setTag(e.target.value)} aria-label="Tag">
            <option value="">No tag</option>
            {tags.map((t) => (
              <option key={t.id || t.name} value={t.name}>
                {t.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-label="Due date"
          />
        </div>
        <div className="sm:col-span-1 flex items-stretch">
          <Button onClick={addTask} fullWidth>
            Add
          </Button>
        </div>
      </div>

      {/* quick glance list to confirm adds */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Recently added</h3>
          <span className="text-xs text-muted-foreground">{tasks.length} total</span>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tasks yet. Add one above.</p>
        ) : (
          <ul className="divide-y divide-border">
            {upcoming.map((t) => (
              <li key={t.id} className="py-2 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{t.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.date} {t.tag ? `· #${t.tag}` : ""}
                  </p>
                </div>
                <button
                  className="text-xs text-rose-600 hover:underline"
                  onClick={() => deleteTask(t.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
