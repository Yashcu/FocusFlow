import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#4f46e5", "#f59e0b", "#10b981", "#ef4444", "#3b82f6"];

const data = [
  { name: "Coding", value: 8 },
  { name: "Reading", value: 3 },
  { name: "Meetings", value: 2 },
  { name: "Design", value: 4 },
  { name: "Break", value: 1 },
];

const TagTimeBreakdown = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={90}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TagTimeBreakdown;
