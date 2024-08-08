import React, { useEffect, useRef, useState } from "react";
import Portal from "../comps/Portal";
import TextInput from "./TextInput";
import { textInputTypes } from "@/util/data";

const locationShareStates = {
  none: "none",
  success: "success",
  not_supported: "not_supported",
};
export default function HelpForm({ onClose }) {
  const inputData = useRef({
    name: "",
    details: "",
    phone: "",
    lat: 0,
    lon: 0,
  });
  const [locationShareState, setLocationShareState] = useState(
    locationShareStates.none
  );
  const isPending = useRef(false);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    if (isPending.current) return;
    isPending.current = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          inputData.current.lat = position.coords.latitude;
          inputData.current.lon = position.coords.longitude;
          isPending.current = false;
          setLocationShareState(locationShareStates.success);
        },
        (error) => {
          console.error(error.message);
          isPending.current = false;
          setLocationShareState(locationShareStates.not_supported);
        }
      );
    } else {
      isPending.current = false;
      setLocationShareState(locationShareStates.not_supported);

      console.error("Geolocation is not supported by this browser.");
    }
  };

  const onSubmit = async () => {
    if (isPending.current) return;

    if (!locationShareState === locationShareStates.success) {
      window.alert("ব্রাউজারের সেটিংস থেকে লোকেশন শেয়ার করুন");
    }
    isPending.current = true;

    try {
      const req = await fetch("/api/help", {
        method: "POST",
        body: JSON.stringify(inputData.current),
      });
      if (!req.ok) {
        if (req.status === 300) {
          const res = await req.json();
          window.alert(res.message);
        } else {
          window.alert("ইন্টারনেট কানেকশন চেক করুন, পুনরায় সাবমিট করুন");
        }

        isPending.current = false;

        return;
      }
      const res = await req.json();
      if (res.success) {
        onClose();
      } else {
        console.error(res.message);
      }
      window.alert(res.message);
    } catch (error) {
      console.error(error.message);
      window.alert("ইন্টারনেট কানেকশন চেক করুন, পুনরায় সাবমিট করুন");
    }
    isPending.current = false;
  };

  return (
    <Portal>
      <div className="w-full h-full backdrop-brightness-50 flex justify-center items-center text-black">
        <div className="w-5/6 h-5/6 bg-white rounded-xl relative flex justify-center items-center">
          <button
            onClick={() => {
              onClose();
            }}
            className="absolute top-2 right-2 rounded-full bg-black transition-all duration-300
          text-white w-8 h-8 flex justify-center items-center pt-1 hover:text-red-500"
          >
            X
          </button>

          <div className="w-80 h-full flex flex-col gap-4 px-10 py-24 justify-between">
            <div className="w-full h-fit flex flex-col gap-4">
              <TextInput
                label={"আপনার নাম (অপশনাল)"}
                type={"text"}
                onChange={(value) => {
                  inputData.current.name = value;
                }}
              />
              <TextInput
                label={"পরিস্থিতির বিবরণ (অপশনাল) (২৫০ অক্ষরে)"}
                type={textInputTypes.textarea}
                onChange={(value) => {
                  inputData.current.details = value;
                }}
              />
              <TextInput
                label={"আপনার ফোন (অপশনাল)"}
                type={"text"}
                onChange={(value) => {
                  inputData.current.phone = value;
                }}
              />

              {locationShareState === locationShareStates.none && (
                <button
                  onClick={(e) => {
                    getLocation(e);
                  }}
                  className="w-full h-fit pt-2.5 pb-1.5 px-4 bg-teal-500 rounded-lg text-white"
                >
                  লোকেশন শেয়ার করুন
                </button>
              )}
              {locationShareState === locationShareStates.success && (
                <p>লোকেশন শেয়ার করা হয়েছে</p>
              )}
              {locationShareState === locationShareStates.not_supported && (
                <TextInput
                  label={"লোকেশন লিখুন"}
                  type={"text"}
                  onChange={(value) => {
                    inputData.current.details += value;
                  }}
                />
              )}
            </div>

            <button
              onClick={() => {
                onSubmit();
              }}
              className="w-full h-fit pt-2.5 pb-1.5 px-4 bg-red-500 rounded-lg text-white"
            >
              সাবমিট
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
