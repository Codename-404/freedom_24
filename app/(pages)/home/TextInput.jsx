import React, { useEffect, useId, useRef, useState } from "react";

import { textInputTypes } from "@/util/data";

export default function TextInput({
  type,
  className,
  label,
  defaultValue,
  onChange,
  clearValue,
  placeholder,
  required,
  disabled,
  min,
  checkIfValid,
}) {
  const inputId = useId();
  const inputVal = useRef("");
  const [showWarning, setShowWarning] = useState(false);

  const setDisplayToInputVal = () => {
    const ele = document.getElementById(inputId);
    if (!ele) return;
    ele.value = inputVal.current;
  };

  const checkValidity = (isValid) => {
    setShowWarning(!isValid);
  };
  useEffect(() => {
    if (checkIfValid) {
      checkIfValid(checkValidity);
    }
    inputVal.current = defaultValue || "";

    setTimeout(() => {
      setDisplayToInputVal();
    }, 100);
  }, [defaultValue, checkIfValid]);

  useEffect(() => {
    if (clearValue) {
      inputVal.current = "";
      const ele = document.getElementById(inputId);
      if (!ele) return;
      ele.value = "";
    }
  }, [clearValue]);

  const onChangeValue = (value) => {
    if (
      required &&
      ((!value && typeof value !== "number") || (value && value.length <= 0))
    ) {
      console.log(
        "input cond",
        label,
        !value && typeof value !== "number",
        value && value.length <= 0
      );
      setShowWarning(true);
    } else if (showWarning) {
      setShowWarning(false);
    }
    inputVal.current = value;
    setDisplayToInputVal();
  };

  const onChangeInput = (e) => {
    let inputVal = e.target.value;

    if (onChange) {
      const val = onChange(inputVal);
      if (typeof val === "object") {
        // here extract val, showWarning state, message etc.
      } else {
        onChangeValue(val || inputVal);
      }
    } else {
      onChangeValue(inputVal);
    }
  };

  return (
    <div className="w-full h-fit flex flex-col text-black text-base">
      {label && (
        <div className={`w-full h-6 flex gap-2 items-center`}>
          <label className="w-fit h-full" htmlFor={inputId}>
            {label || ""} {required && <span className="">*</span>}
          </label>
        </div>
      )}

      {type !== textInputTypes.textarea && (
        <input
          id={inputId}
          // value={value}
          onChange={(e) => {
            onChangeInput(e);
          }}
          min={min || 0}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          className={`${
            className ? className : "w-full h-10 rounded-md outline-none p-2"
          } 
          ${showWarning ? "bg-red-400/30" : "bg-neutral-300"}`}
        />
      )}
      {type === textInputTypes.textarea && (
        <textarea
          id={inputId}
          // value={value || ""}
          onChange={(e) => {
            onChangeInput(e);
          }}
          disabled={disabled}
          placeholder={placeholder}
          className={`${className} w-full h-24 rounded-md outline-none p-2
          ${showWarning ? "bg-red-400/30" : "bg-neutral-300"}`}
        />
      )}
    </div>
  );
}
