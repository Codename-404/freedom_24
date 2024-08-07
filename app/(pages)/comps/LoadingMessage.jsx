import React from "react";
import LoadingCircle from "./LoadingCircle";

// A loading message component, shows Loading circle and a message
export default function LoadingMessage({ message }) {
  return (
    <div
      className="w-full h-fit flex flex-wrap gap-2 
    justify-center items-center text-center "
    >
      <LoadingCircle />
      <p className="text-white">{message}</p>
    </div>
  );
}
