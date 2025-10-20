import React from "react";

export function Badge({ children }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-gray-200 text-gray-800">
      {children}
    </span>
  );
}
