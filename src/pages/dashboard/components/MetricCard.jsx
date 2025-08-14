import React from "react";

const MetricCard = ({ title, value }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col items-start justify-center">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
        {value}
      </h3>
    </div>
  );
};

export default MetricCard;
