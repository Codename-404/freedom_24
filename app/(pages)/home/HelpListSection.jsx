"use client";

import React, { useEffect, useRef, useState } from "react";
import HelpCard from "./HelpCard";
import LoadingScreen from "../comps/LoadingScreen";
import LoadingMessage from "../comps/LoadingMessage";
import { haversineDistance, helpKeys, makeQueryStringUrl } from "@/util/data";

const REFRESH_TIME = 30;
const FORCE_REFRESH_TIME = 5;
const fetchStates = {
  idle: "idle",
  loading: "loading",
  shareLocation: "shareLocation",
  locationNotAvailable: "locationNotAvailable",
};

export default function HelpListSection() {
  const [refreshTimeCounter, setRefreshTimeCounter] = useState(0);
  const forceRefreshCounter = useRef(FORCE_REFRESH_TIME);
  const [fetchState, setFetchState] = useState(fetchStates.shareLocation);
  const interval = useRef(null);
  const needHelpData = useRef([]);
  const testData = useRef([]);
  const [sortBy, setSortBy] = useState("time");
  const userLocation = useRef(null);

  useEffect(() => {
    if (!userLocation.current) {
      getLocation();
    } else {
      setFetchState(fetchStates.idle);
    }
  }, []);

  useEffect(() => {
    if (fetchState === fetchStates.idle) {
      console.log("resetting fetch counter", refreshTimeCounter);
      setRefreshTimeCounter(REFRESH_TIME);
    } else if (fetchState !== fetchStates.loading) {
      if (!userLocation.current) {
        getLocation();
      }
    }
  }, [fetchState]);

  const getLocationPermission = () => {
    if ("geolocation" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        console.log("geolocation permission state", result.state);
        if (result.state !== "granted") {
          setFetchState(fetchStates.locationNotAvailable);
        }
        if (result.state === "granted") {
          getLocation();
        } else if (result.state === "prompt") {
          requestGeolocation();
        }
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          userLocation.current = {};
          userLocation.current.lat = position.coords.latitude;
          userLocation.current.lon = position.coords.longitude;
          fetchData(true);
          // setFetchState(fetchStates.idle);

          console.log("found location", userLocation.current);
        },
        (error) => {
          console.error(error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const fetchData = async (ignoreFetchState) => {
    if (!userLocation.current) {
      // forceRefreshCounter.current = FORCE_REFRESH_TIME;
      // setRefreshTimeCounter(REFRESH_TIME);
      // setFetchState(fetchStates.shareLocation);
      getLocation();

      return;
    }
    if (
      !ignoreFetchState &&
      (fetchState === fetchStates.shareLocation ||
        fetchState === fetchStates.locationNotAvailable)
    ) {
      // forceRefreshCounter.current = FORCE_REFRESH_TIME;
      // setRefreshTimeCounter(REFRESH_TIME);
      // setFetchState(fetchStates.idle);
      return;
    }

    if (fetchState === fetchStates.loading) return;

    setFetchState(fetchStates.loading);
    clearInterval(interval.current);

    const helpDataReq = await fetch(
      makeQueryStringUrl("/api/help", {
        lat: userLocation.current.lat,
        lon: userLocation.current.lon,
        radius: userLocation.current.radius,
      })
    );

    needHelpData.current = [];
    testData.current = [];

    if (helpDataReq.ok) {
      const helpData = await helpDataReq.json();
      console.log("coming help data", helpData);

      if (helpData.success) {
        for (let i = 0; i < helpData.data.length; i++) {
          const dist = haversineDistance(
            userLocation.current.lat,
            userLocation.current.lon,
            helpData.data[i][helpKeys.lat],
            helpData.data[i][helpKeys.lon]
          );

          console.log("dist", dist);

          if (!helpData.data[i][helpKeys.isTest]) {
            needHelpData.current.push({
              ...helpData.data[i],
              dist: dist,
            });
          } else {
            testData.current.push({
              ...helpData.data[i],
              dist: dist,
            });
          }

          console.log("found help data and test data", {
            needHelpData: needHelpData.current,
            testData: testData.current,
          });
        }
      }
    }

    forceRefreshCounter.current = FORCE_REFRESH_TIME;
    // setRefreshTimeCounter(REFRESH_TIME);
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

  const getSortedData = () => {
    console.log("coming to sort", sortBy);
    if (!needHelpData.current || !testData.current) return [];

    if (sortBy === "time") {
      return needHelpData.current.sort((a, b) => a.time - b.time);
    } else if (sortBy === "distance") {
      return needHelpData.current.sort((a, b) => {
        return (a.dist || 0) - (b.dist || 0);
      });
    } else {
      console.log("sorting test data", testData.current);
      const sorted = testData.current.sort((a, b) => {
        return (a?.dist || 0) - (b?.dist || 0);
      });
      console.log("sorted test data", sorted);
      return sorted;
    }
  };

  return (
    <div className="w-full h-full relative flex flex-col">
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
        <div className="w-fit h-fit text-white flex gap-2">
          <p>ফিল্টার করুন</p>
          <select
            className="rounded-md px-4 text-black"
            onChange={(e) => {
              console.log("setting sort by", e.target.value);
              setSortBy(e.target.value);
            }}
          >
            <option value="time">সময়</option>
            <option value="distance">দূরত্ব</option>
            <option value="test">Test</option>
          </select>
        </div>

        <button
          disabled={forceRefreshCounter.current}
          onClick={() => {
            if (!userLocation.current) {
              window.alert("ব্রাউজার সেটিংস থেকে লোকেশন শেয়ার করুন");
              return;
            }
            fetchData();
          }}
          className="w-16 flex gap-2 cursor-pointer disabled:text-neutral-600"
        >
          রিফ্রেশ {refreshTimeCounter}
        </button>
      </div>
      <div
        className="w-full grow scroll-1
  border rounded-xl overflow-y-auto overflow-x-hidden"
      >
        {(sortBy !== "test" && needHelpData.current.length) ||
        (sortBy === "test" && testData.current.length) ? (
          <div className="w-full h-fit flex flex-col gap-4 ">
            {getSortedData().map((data) => {
              return <HelpCard key={data.id} info={data} />;
            })}
          </div>
        ) : (
          ""
        )}

        {needHelpData.current.length === 0 &&
          fetchState === fetchStates.idle && (
            <div className="w-full h-full flex justify-center items-center">
              <p className="text-2xl">গত ১ ঘণ্টায় কেউ সাহায্যের আবেদন করেননি</p>
            </div>
          )}
        {(fetchState === fetchStates.shareLocation ||
          fetchState === fetchStates.locationNotAvailable) && (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <p className="text-2xl">
              {fetchState === fetchStates.locationNotAvailable
                ? "ম্যানুয়ালি লোকেশন পারমিশন এনাবল করুন, সেটিংস পরিবর্তন করুন"
                : "আপনার লোকেশন শেয়ার করুন"}
            </p>
            <button
              onClick={(e) => {
                getLocationPermission();
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
  );
}
