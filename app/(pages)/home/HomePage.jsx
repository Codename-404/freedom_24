"use client";

import React, { useEffect, useState } from "react";
import HelpButton from "./HelpButton";
import HelpListSection from "./HelpListSection";
import ArmyContact from "../comps/ArmyContact";
import AuthWindow from "../comps/AuthWindow";

export default function HomePage() {
  const [sessionData, setSessionData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const getLocation = () => {
    if (!sessionData) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);

          // setFetchState(fetchStates.idle);
        },
        (error) => {
          console.error(error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };
  useEffect(() => {
    getLocation();
  }, [sessionData]);

  return (
    <div className="w-screen h-screen min-h-screen p-4 md:p-10 relative">
      <div
        className="w-full h-full md:grid md:grid-cols-2 
      flex flex-col gap-4 justify-between  overflow-hidden"
      >
        <div className="w-full h-48  md:h-full  flex flex-col gap-4 justify-start items-center">
          <div className="w-full h-full flex flex-col">
            <div className="w-full h-fit ">
              <div className="w-full h-fit pb-4">
                <ArmyContact />
              </div>
            </div>
            {userLocation && <HelpButton userLocation={userLocation} />}
            <div className="w-full grow flex md:flex-col">
              <img
                src="/images/bd_flag_rect.webp"
                alt="image"
                className="md:w-full w-60 md:max-w-2xl h-fit object-contain hidden md:block"
              />
              <div className="w-full h-full flex flex-col md:gap-2 text-center justify-center">
                <h2 className="text-lg md:text-2xl hidden md:block">
                  একে অপরকে সাহায্য করি
                </h2>
                <p className="text-xl md:text-4xl text-white hidden md:block">
                  সন্ত্রাসমুক্ত বাংলাদেশ গড়ি
                </p>
              </div>
            </div>
          </div>

          {/* <div className="w-full flex flex-col gap-1 tracking-wide">
          <p>
            ইনশাআল্লাহ, স্বাধীন বাংলাদেশে সকল সন্ত্রাসকে বিচারের আয়তায় আনা হবেই।
            তবে আইন নিজের কাঁধে তুলে নিয়ে কিছু স্বার্থ অন্বেষীদের এর সুযোগ নিতে
            দিবেন না।
          </p>
          <div className="w-full flex flex-col">
            <p>
              দীনের ব্যাপারে যারা তোমাদের সাথে যুদ্ধ করেনি, আর তোমাদেরকে তোমাদের
              ঘর-বাড়ী থেকে বের ক’রে দেয়নি তাদের সঙ্গে সদয় ব্যবহার করতে আর
              ন্যায়নিষ্ঠ আচরণ করতে আল্লাহ নিষেধ করেন নি। আল্লাহ ন্যায়পরায়ণদেরকে
              ভালবাসেন।
            </p>
            <p className="w-full text-end">- আল-মুমতাহিনাঃ ৮</p>
          </div>
          <p>
            ৮৫%+ মুসলিমের দেশে পাবলিক এড়িয়া গুলতে বিভিন্ন মূর্তির যথাযথ
            ব্যাবস্থ্যা নিবেন বলে আমরা নতুন সরকারের প্রতি আশাবাদী।
          </p>
        </div> */}
        </div>

        <div
          className="w-full grow md:h-full 
      flex flex-col justify-start items-center gap-2"
        >
          {userLocation && <HelpListSection userLocation={userLocation} />}
          {!userLocation && (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <p className="text-2xl">"আপনার লোকেশন শেয়ার করুন"</p>
              <button
                onClick={(e) => {
                  getLocation(e);
                }}
                className="w-60 h-fit pt-2.5 pb-1.5 px-4 bg-teal-500 rounded-lg text-white"
              >
                লোকেশন শেয়ার করুন
              </button>
            </div>
          )}
        </div>
      </div>

      <AuthWindow sessionData={sessionData} setSessionData={setSessionData} />
    </div>
  );
}
