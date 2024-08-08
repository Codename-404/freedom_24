"use client";

import { armyNumber, convertNumbersToEnglish } from "@/util/data";
import React, { useState } from "react";
import { FaCopy } from "react-icons/fa";
import NumberCard from "./NumberCard";

export default function ArmyContact() {
  const [selectedDivision, setSelectedDivision] = useState("ঢাকা মহানগর");
  const [selectedDistrict, setSelectedDistrict] = useState();

  return (
    <div
      style={{
        backgroundColor: "#006A4E",
      }}
      className="w-full h-fit flex  flex-col 
       text-xs md:text-base rounded-xl md:px-4 pt-1 
      pb-0 md:pb-2 justify-between 
       items-center text-white"
    >
      <p className="w-full text-center font-bold text-lg md:text-xl">
        বাংলাদেশ সেনাবাহিনী
      </p>
      <div
        className="w-full h-fit flex flex-col md:flex-row md:gap-2 
      justify-between md:items-end items-center"
      >
        <div className="w-full md:w-fit h-fit flex flex-col leading-3">
          <div className="w-full md:w-fit h-fit flex flex-col md:flex-row gap-2 text-black ">
            <div className="w-full md:w-32 px-2 h-fit flex md:flex-col justify-start items-center gap-2 md:gap-0">
              <p className="text-white">বিভাগ</p>
              <select
                className="w-full px-2 pt-0.5 rounded-md"
                onChange={(e) => setSelectedDivision(e.target.value)}
              >
                {Object.keys(armyNumber).map((key) => {
                  return (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="w-full md:w-32 px-2 h-fit flex md:flex-col justify-start items-center gap-2 md:gap-0">
              <p className="text-white">জেলা</p>
              <select
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedDivision}
                className="w-full max-w-full px-2 pt-0.5 rounded-md"
              >
                {[
                  "বাছায় করুন",
                  ...Object.keys(armyNumber[selectedDivision]),
                ].map((key) => {
                  return (
                    <option
                      className="w-full overflow-clip"
                      key={key}
                      value={key}
                    >
                      {key}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
        {selectedDivision && selectedDistrict && (
          <div className="w-fit h-fit flex flex-col">
            {armyNumber[selectedDivision][selectedDistrict].map((num) => {
              return (
                <NumberCard key={num} number={convertNumbersToEnglish(num)} />
              );
            })}
          </div>
        )}
        {(!selectedDivision ||
          !selectedDistrict ||
          selectedDistrict === "বাছায় করুন") && (
          <div className="">বিভাগ ও জেলা নির্বাচন করুন</div>
        )}
      </div>
    </div>
  );
}
