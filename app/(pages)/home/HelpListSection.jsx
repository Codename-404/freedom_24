"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import HelpCard from "./HelpCard";
import LoadingScreen from "../comps/LoadingScreen";
import LoadingMessage from "../comps/LoadingMessage";
import { haversineDistance, helpKeys, makeQueryStringUrl } from "@/util/data";
import useRefreshComponent from "../comps/useRefreshComponent";
import InfiniteScroll from "react-infinite-scroll-component";
import useWindowResize from "../comps/useWindowResize";

const REFRESH_TIME = 30;
const FORCE_REFRESH_TIME = 5;
const fetchStates = {
  idle: "idle",
  loading: "loading",
  shareLocation: "shareLocation",
  locationNotAvailable: "locationNotAvailable",
};

export default function HelpListSection({ userLocation }) {
  const [canRefresh, setCanRefresh] = useState(true);
  const [fetchState, setFetchState] = useState(fetchStates.shareLocation);
  const interval = useRef(null);
  const needHelpData = useRef([]);
  const testData = useRef([]);
  const [sortBy, setSortBy] = useState("time");
  const radius = useRef(5);
  const lastRefreshTime = useRef(0);

  const refreshComp = useRefreshComponent();
  const userHelpData = useRef([]);
  const page = useRef(0);
  const hasMore = useRef(true);
  const windowSize = useWindowResize();

  const calculateListContainerHeight = () => {
    if (typeof window === "undefined") return;

    const ele = document.getElementById("container_scale_comp");
    const hardHeight =
      windowSize.width <= 768
        ? windowSize.height * 0.6
        : windowSize.height * 0.8;
    if (!ele) return hardHeight;

    return ele.getBoundingClientRect().height || hardHeight;
  };

  const [listContainerHeight, setListContainerHeight] = useState(
    calculateListContainerHeight()
  );
  useEffect(() => {
    setListContainerHeight(calculateListContainerHeight());
  }, [windowSize]);

  useEffect(() => {
    if (userLocation) {
      setFetchState(fetchStates.idle);
    }
  }, []);

  const getLocationPermission = () => {
    if ("geolocation" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
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

  useEffect(() => {
    if (canRefresh) return;

    const timer = setTimeout(() => {
      setCanRefresh(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [canRefresh]);

  const fetchData = async () => {
    if (!userLocation) {
      return;
    }

    if (fetchState === fetchStates.loading) return;

    setCanRefresh(false);

    setFetchState(fetchStates.loading);
    clearInterval(interval.current);

    const helpDataReq = await fetch(
      makeQueryStringUrl("/api/help", {
        lat: userLocation[0],
        lon: userLocation[1],
        radius: radius.current,
        page: page.current,
      })
    );

    if (!page.current) {
      needHelpData.current = [];
      testData.current = [];
    }

    if (helpDataReq.ok) {
      const helpData = await helpDataReq.json();

      if (helpData.success) {
        if (!helpData.data.length) {
          hasMore.current = false;
        } else {
          for (let i = 0; i < helpData.data.length; i++) {
            const dist = haversineDistance(
              userLocation[0],
              userLocation[1],
              helpData.data[i][helpKeys.lat],
              helpData.data[i][helpKeys.lon]
            );

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
          }
          page.current += 1;
        }
      }
    }

    userHelpData.current = getSortedData();

    console.log(
      "total data",
      needHelpData.current.length + testData.current.length
    );

    refreshComp();
    // setRefreshTimeCounter(REFRESH_TIME);
    setFetchState(fetchStates.idle);
  };

  const getSortedData = () => {
    if (!needHelpData.current || !testData.current) return [];

    if (sortBy === "time") {
      return needHelpData.current.sort((a, b) => a.time - b.time);
    } else if (sortBy === "distance") {
      return needHelpData.current.sort((a, b) => {
        return (a.dist || 0) - (b.dist || 0);
      });
    } else {
      const sorted = testData.current.sort((a, b) => {
        return (a?.dist || 0) - (b?.dist || 0);
      });
      return sorted;
    }
  };

  useEffect(() => {
    if (!needHelpData.current.length || !testData.current.length) {
      fetchData();
    }
  }, [userLocation]);

  const onRefreshScroll = async () => {
    page.current = 0;
    hasMore.current = true;
    await fetchData();
  };

  return (
    <div className="w-full h-full relative flex flex-col gap-2 ">
      {fetchState === fetchStates.loading && (
        <div
          className="absolute w-full h-full z-20 
        backdrop-brightness-50 flex justify-center items-center"
        >
          <LoadingMessage message={"Refreshing data..."} />
        </div>
      )}

      <div className="w-full h-10 flex justify-between">
        <h1>অন্যকে সাহায্য করুন</h1>
        <div className="w-fit h-fit text-white flex gap-2">
          <p>ফিল্টার করুন</p>
          <select
            className="rounded-md px-2 text-black"
            onChange={(e) => {
              setSortBy(e.target.value);
            }}
          >
            <option value="time">সময়</option>
            <option value="distance">দূরত্ব</option>
            <option value="test">Test</option>
          </select>
        </div>

        <button
          disabled={!canRefresh}
          onClick={() => {
            if (!userLocation) {
              window.alert("ব্রাউজার সেটিংস থেকে লোকেশন শেয়ার করুন");
              return;
            }
            if ((Date.now() - lastRefreshTime.current) / 1000 > 5) {
              onRefreshScroll();
            }
          }}
          className="w-16 flex gap-2 cursor-pointer disabled:text-neutral-600"
        >
          রিফ্রেশ
        </button>
      </div>
      <div
        className="w-full grow scroll-1  relative
  border rounded-xl overflow-y-auto overflow-x-hidden infinite-scroll-component__outerdiv"
      >
        <div
          id="container_scale_comp"
          onLoad={() => {
            setListContainerHeight(calculateListContainerHeight());
          }}
          className="absolute w-full h-full pointer-events-none"
        ></div>
        <div className="relative w-full h-full ">
          {(sortBy !== "test" && needHelpData.current.length) ||
          (sortBy === "test" && testData.current.length) ? (
            // <div className="w-full h-fit flex flex-col gap-4 ">
            <InfiniteScroll
              // height={
              //   windowSize.width <= 768
              //     ? windowSize.height * 0.6
              //     : windowSize.height * 0.8
              // }
              className="scroll-1"
              height={listContainerHeight}
              dataLength={userHelpData.current.length} //This is important field to render the next data
              next={fetchData}
              hasMore={hasMore.current}
              loader={<h4>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>সমাপ্তি</b>
                </p>
              }
              // below props only if you need pull down functionality
              refreshFunction={onRefreshScroll}
              pullDownToRefresh
              pullDownToRefreshThreshold={50}
              pullDownToRefreshContent={
                <h3 style={{ textAlign: "center" }}>
                  &#8595; Pull down to refresh
                </h3>
              }
              releaseToRefreshContent={
                <h3 style={{ textAlign: "center" }}>
                  &#8593; Release to refresh
                </h3>
              }
            >
              {userHelpData.current.map((data) => {
                return <HelpCard key={data.id} info={data} />;
              })}
            </InfiniteScroll>
          ) : (
            // </div>
            ""
          )}
        </div>
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
