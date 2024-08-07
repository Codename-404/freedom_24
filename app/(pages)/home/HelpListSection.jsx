"use client";

import React, { useEffect, useRef, useState } from "react";
import HelpCard from "./HelpCard";
import LoadingScreen from "../comps/LoadingScreen";
import LoadingMessage from "../comps/LoadingMessage";

const REFRESH_TIME = 30;
const FORCE_REFRESH_TIME = 5;
const fetchStates = {
  idle: "idle",
  loading: "loading",
  success: "success",
  error: "error",
};

export default function HelpListSection() {
  const [refreshTimeCounter, setRefreshTimeCounter] = useState(0);
  const forceRefreshCounter = useRef(FORCE_REFRESH_TIME);
  const [fetchState, setFetchState] = useState(fetchStates.idle);
  const interval = useRef(null);
  const needHelpData = useRef([]);

  const fetchData = async () => {
    setFetchState(fetchStates.loading);
    clearInterval(interval.current);

    const helpDataReq = await fetch("/api/help");
    if (helpDataReq.ok) {
      const helpData = await helpDataReq.json();
      console.log("coming help data", helpData);

      if (helpData.success) {
        needHelpData.current = helpData.data;
      }
    }

    forceRefreshCounter.current = FORCE_REFRESH_TIME;
    setRefreshTimeCounter(REFRESH_TIME);
    setFetchState(fetchStates.idle);
  };

  useEffect(() => {
    console.log("fetchState", fetchState);
  }, [fetchState]);

  useEffect(() => {
    if (refreshTimeCounter === 0) {
      fetchData();
    } else if (fetchState === fetchStates.idle) {
      interval.current = setInterval(() => {
        setRefreshTimeCounter(refreshTimeCounter - 1);
        forceRefreshCounter.current = Math.max(
          0,
          forceRefreshCounter.current - 1
        );
      }, 1000);
      return () => clearInterval(interval.current);
    }
  }, [refreshTimeCounter]);

  return (
    <div className="w-full h-full relative">
      {fetchState === fetchStates.loading && (
        <div
          className="absolute w-full h-full z-20 
        backdrop-brightness-50 flex justify-center items-center"
        >
          <LoadingMessage message={"Refreshing data..."} />
        </div>
      )}

      <div className="w-full h-fit flex justify-between">
        <h1>অন্যকে সাহায্য করুন</h1>

        <button
          disabled={forceRefreshCounter.current}
          onClick={() => {
            fetchData();
          }}
          className="w-fit flex gap-2 cursor-pointer disabled:text-neutral-600"
        >
          রিফ্রেশ {refreshTimeCounter}
        </button>
      </div>
      <div
        className="w-full h-full scroll-1
  border rounded-xl overflow-y-auto overflow-x-hidden"
      >
        {needHelpData.current.length ? (
          <div className="w-full h-fit flex flex-col gap-4 ">
            {needHelpData.current.map((data) => {
              return <HelpCard key={data.id} info={data} />;
            })}
          </div>
        ) : (
          ""
        )}

        {needHelpData.current.length === 0 && (
          <div className="w-full h-full flex justify-center items-center">
            <p className="text-2xl">
              আপনার নিকটবর্তি কেউ সাহায্যের আবেদন করেননি
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
