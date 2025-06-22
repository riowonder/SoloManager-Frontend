import React from "react";

export default function Spinner() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative w-12 h-12">
        <div className="absolute w-full h-full border-4 border-gray-200 rounded-full"></div>
        <div className="absolute w-full h-full border-4 border-t-black rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
