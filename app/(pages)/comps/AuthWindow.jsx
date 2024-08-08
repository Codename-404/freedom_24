"use client";
import React, { useEffect, useState } from "react";
import Portal from "./Portal";
import { getGoogleAuthURL } from "@/util/data";
import LoadingMessage from "./LoadingMessage";
import LoadingScreen from "./LoadingScreen";

export default function AuthWindow({ sessionData, setSessionData }) {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (sessionData) return;
    const checkSession = async () => {
      const session = await fetch("/api/auth");
      if (!session.ok) {
        setIsChecking(false);
        return;
      }
      const sessionRes = await session.json();
      if (!sessionRes.success) {
        setIsChecking(false);
        return;
      }
      setSessionData(sessionRes);
      setIsChecking(false);
    };

    checkSession();
  }, [sessionData]);

  return (
    <div>
      {!sessionData && isChecking && (
        <LoadingScreen message={"Checking session..."} />
      )}
      {!sessionData && !isChecking && (
        <Portal>
          <div className="w-full h-full backdrop-brightness-50 flex justify-center items-center">
            <div className="w-5/6 h-5/6 rounded-xl bg-white border border-black flex flex-col gap-4 p-10 justify-start items-center">
              <div
                className="w-80 h-full flex flex-col justify-start items-center 
              bg-army_green rounded-xl p-10 text-center tracking-wide"
              >
                <h2 className="text-4xl text-white">সাইন ইন করুন</h2>
                <p>
                  বিঃদ্রঃ এটি সেনাবাহিনী বা সরকারী কোন প্রতিষ্ঠান হতে পরিচালিত
                  নয়
                </p>
                <p>এই সাইটটি ব্যাবহারের জন্য আপনার লোকেশন শেয়ার করতে হবে</p>
                <div className="w-full grow flex flex-col gap-4 justify-center items-center">
                  <button
                    className="bg-white rounded-xl shadow-md shadow-black px-4 py-2 text-2xl text-black"
                    onClick={(e) => {
                      window.location = getGoogleAuthURL();
                    }}
                  >
                    Google
                  </button>
                  <p className="text-xs">
                    By signing up, you agree to our{" "}
                    <span
                      onClick={() => {
                        window.open("/terms_condition.pdf", "_blank");
                      }}
                      className="underline cursor-pointer"
                    >
                      terms and conditions
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
