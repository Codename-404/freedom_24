import React from "react";
import { FaCopy } from "react-icons/fa";
import { IoCall } from "react-icons/io5";

export default function NumberCard({ number }) {
  return (
    <div className="w-fit h-fit flex gap-1 md:gap-2 justify-center items-center text-base md:text-xl font-bold ">
      <p className="pt-1">{number}</p>
      <FaCopy
        className="cursor-pointer"
        onClick={async (e) => {
          await navigator.clipboard.writeText(number);
          window.alert("ফোন নাম্বার কপি হয়েছে");
        }}
      />

      <a href={`tel:${number}`} style={{ textDecoration: "none" }}>
        <IoCall />
      </a>
    </div>
  );
}
