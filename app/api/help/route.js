import { getDB } from "@/db/getDB";
import { HelpModel, TestModel } from "@/db/models";
import { helpKeys } from "@/util/data";
import { getBoundingBox } from "@/util/serverUtilFunc";
import { D1Orm, GenerateQuery, QueryType } from "d1-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { v4 } from "uuid";

export const runtime = "edge";

const HELP_REQUEST_INTERVAL = 10 * 60 * 1000;

const getUserIp = (lat, lon) => {
  let userIp = headers().get("cf-connecting-ip");

  if (!userIp) {
    userIp = [lat, lon].join(",");
  }

  return userIp;
};

export async function GET(request) {
  const orm = new D1Orm(getDB());
  const helpModel = HelpModel(orm);

  const url = new URL(request.url);

  // let lat = url.searchParams.get("lat");
  // let lon = url.searchParams.get("lon");
  // let radius = url.searchParams.get("radius") || 5;

  // if (radius === "undefined") radius = 5;

  if (!lat || !lon) {
    return new NextResponse(
      JSON.stringify({
        data: [],
        success: false,
        message:
          "Your location is required, share your location from the browser",
      }),
      { status: 500 }
    );
  }

  try {
    // lat = Number(lat);
    // lon = Number(lon);
    //   const paylaod = [];
    //   for (let i = 0; i < 100; i++) {
    //     paylaod.push({
    //       id: i,
    //       value: i + Math.random(),
    //       added_at: Date.now(),
    //     });
    //   }
    //   const allData = await testModel.InsertMany(paylaod);

    // const { latMin, latMax, lonMin, lonMax } = getBoundingBox(lat, lon, radius);

    // console.log("coming bounding box", {
    //   latMin,
    //   latMax,
    //   lonMin,
    //   lonMax,
    // });

    const qurObj = {
      query: "SELECT * FROM helpdata WHERE added_at >= ?;",
      binding: [Date.now() - 1 * 60 * 60 * 1000],
    };

    const allData = await orm
      .prepare(qurObj.query)
      .bind(...qurObj.binding)
      .all();

    // const allData = await helpModel.All({where:{added_at}});
    if (allData.error) {
      console.log("Error on help GET db", allData.error);

      return new NextResponse(
        JSON.stringify({
          data: [],
          success: false,
          message: "Something went wrong, try again",
        }),
        { status: 500 }
      );
    }

    const modified = [];
    for (let i = 0; i < allData.results.length; i++) {
      let time = (Date.now() - allData.results[i][helpKeys.added_at]) / 1000;
      time = Math.floor(time / 60);

      modified.push({ ...allData.results[i], time });
    }
    console.log("found help data", allData.results);

    return new NextResponse(
      JSON.stringify({
        data: modified,
        success: true,
        message: "Successfully fetched help items",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error on help GET", error.message);

    return new NextResponse(
      JSON.stringify({
        data: [],
        success: false,
        message: "Something went wrong, try again",
      }),
      { status: 500 }
    );
  }
}
export async function POST(request) {
  const orm = new D1Orm(getDB());
  const helpModel = HelpModel(orm);

  const paylaod = await request.json();

  try {
    const userIp = getUserIp(paylaod.lat, paylaod.lon);

    const isRequested = await helpModel.First({
      where: { victim_ip: userIp },
    });
    console.log("coming paylaod", paylaod);

    if (isRequested) {
      if (Date.now() - isRequested[helpKeys.added_at] < HELP_REQUEST_INTERVAL) {
        return new NextResponse(
          JSON.stringify({
            data: [],
            success: false,
            message: `You have already requested help, Wait ${
              (HELP_REQUEST_INTERVAL -
                (Date.now() - isRequested[helpKeys.added_at])) /
              1000
            } seconds to request again`,
          }),
          { status: 300 }
        );
      }
      await helpModel.Delete({ where: { victim_ip: userIp } });
    }

    const res = await helpModel.InsertOne({
      ...paylaod,
      id: v4(),
      views: 0,
      victim_ip: userIp.toString(),
      added_at: Date.now(),
    });

    if (res.error) {
      return new NextResponse(
        JSON.stringify({
          data: [],
          success: false,
          message: "Something went wrong, try again",
        }),
        { status: 500 }
      );
    }

    // const qurObj = {
    //   query: "SELECT * FROM testdata WHERE value BETWEEN ? AND ?;",

    //   binding: [0, 80.6],
    // };

    // const allData = await orm
    //   .prepare(qurObj.query)
    //   .bind(...qurObj.binding)
    //   .all();

    return new NextResponse(
      JSON.stringify({
        data: null,
        success: true,
        message: "সফলভাবে আপনার রিকুয়েস্টটি সংরক্ষিত হয়েছে।",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error on help POST", error.message);

    return new NextResponse(
      JSON.stringify({
        data: [],
        success: false,
        message: "Something went wrong, try again",
      }),
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const orm = new D1Orm(getDB());
  const helpModel = HelpModel(orm);

  const paylaod = await request.json();
  const userIp = getUserIp(paylaod.lat || 0, paylaod.lon || 0);

  try {
    const isRequested = await helpModel.First({
      where: { id: paylaod.id },
    });

    if (!isRequested) {
      return new NextResponse(
        JSON.stringify({
          data: [],
          success: false,
          message: "Update failed, not found",
        }),
        { status: 500 }
      );
    }

    if (isRequested[helpKeys.victim_ip === userIp]) {
      return new NextResponse(
        JSON.stringify({
          data: [],
          success: false,
          message: "Same user, should not update views",
        }),
        { status: 300 }
      );
    }

    const res = await helpModel.Update({
      where: { id: paylaod.id },
      data: {
        [helpKeys.views]: isRequested[helpKeys.views] + 1,
      },
    });

    if (res.error) {
      return new NextResponse(
        JSON.stringify({
          data: null,
          success: false,
          message: "Something went wrong",
        }),
        { status: 500 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        data: null,
        success: true,
        message: "Successfully updated help view",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error on help PUT", error.message);
    return new NextResponse(
      JSON.stringify({
        data: null,
        success: false,
        message: "Something went wrong",
      }),
      { status: 500 }
    );
  }
}
