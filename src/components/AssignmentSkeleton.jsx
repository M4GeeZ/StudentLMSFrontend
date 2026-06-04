import React from "react";

const AssignmentSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-2xl shadow border border-slate-200 animate-pulse"
        >
          <div className="h-5 bg-slate-200 rounded mb-4"></div>

          <div className="h-4 bg-slate-200 rounded mb-2"></div>

          <div className="h-4 bg-slate-200 rounded mb-2"></div>

          <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>

          <div className="flex gap-2">
            <div className="h-9 w-24 bg-slate-200 rounded-lg"></div>
            <div className="h-9 w-24 bg-slate-200 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssignmentSkeleton;