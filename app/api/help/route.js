import { getDB } from "@/db/getDB";
import { HelpModel, TestModel } from "@/db/models";
import { D1Orm, GenerateQuery, QueryType } from "d1-orm";
import { NextResponse } from "next/server";
import { v4 } from "uuid";

export const runtime = "edge";

export async function GET(request) {
  const orm = new D1Orm(getDB());
  const helpModel = HelpModel(orm);

  try {
    //   const paylaod = [];
    //   for (let i = 0; i < 100; i++) {
    //     paylaod.push({
    //       id: i,
    //       value: i + Math.random(),
    //       added_at: Date.now(),
    //     });
    //   }
    //   const allData = await testModel.InsertMany(paylaod);

    const qurObj = {
      query:
        "SELECT * FROM helpdata WHERE lat BETWEEN ? AND ? AND lon BETWEEN ? AND ?;",
      binding: [0, 100, 0, 100],
    };

    const allData = await orm
      .prepare(qurObj.query)
      .bind(...qurObj.binding)
      .all();

    // const allData = await helpModel.All();
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

    console.log("found help data", allData.results);

    return new NextResponse(
      JSON.stringify({
        data: allData.results,
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
    const res = await helpModel.InsertOne({
      ...paylaod,
      id: v4(),
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
