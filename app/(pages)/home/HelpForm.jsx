import React from "react";
import Portal from "./Portal";

export default function HelpForm({ onClose }) {
  return (
    <Portal>
      <div className="w-full h-full backdrop-brightness-50 flex justify-center items-center">
        <div className="w-5/6 h-5/6 bg-white rounded-xl relative">
          <button
            onClick={() => {
              onClose();
            }}
            className="absolute top-2 right-2 rounded-full bg-black transition-all duration-300
          text-white w-8 h-8 flex justify-center items-center pt-1 hover:text-red-500"
          >
            X
          </button>
        </div>
      </div>
    </Portal>
  );
}
