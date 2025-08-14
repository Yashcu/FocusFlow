import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const data = [
  { day: "Mon", hours: 2 },
  { day: "Tue", hours: 3.5 },
  { day: "Wed", hours: 1.8 },
  { day: "Thu", hours: 4 },
  { day: "Fri", hours: 3.2 },
  { day: "Sat", hours: 5 },
  { day: "Sun", hours: 2.5 },
];

const ProductivityTrendChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
        <XAxis dataKey="day" />
        <YAxis label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="hours"
          stroke="#4f46e5"
          strokeWidth={3}
          dot={{ r: 4, fill: "#4f46e5" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProductivityTrendChart;
