"use client";

import React from "react";
import HelpForm from "./HelpForm";

export default function HelpButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="w-full h-fit">
      <button
        onClick={() => setOpen(true)}
        className="bg-red-500 rounded-xl w-full 
  h-20 md:h-40 text-6xl px-2 pt-1 md:pt-4
transition-all duration-300 hover:bg-red-700"
      >
        সাহায্য চাই
      </button>
      {open && <HelpForm onClose={() => setOpen(false)} />}
    </div>
  );
}
