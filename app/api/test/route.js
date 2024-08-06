import { getDB } from "@/db/getDB";
import { TestModel } from "@/db/models";
import { D1Orm, GenerateQuery, QueryType } from "d1-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request) {
  const orm = new D1Orm(getDB());
  const testModel = TestModel(orm);

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
      query: "SELECT * FROM testdata WHERE value BETWEEN ? AND ?;",

      binding: [0, 80.6],
    };

    const allData = await orm
      .prepare(qurObj.query)
      .bind(...qurObj.binding)
      .all();

    return new NextResponse(
      JSON.stringify({
        data: {
          resLength: allData.results.length,
          reads: allData.meta.rows_read,
        },
        success: true,
        message: "Successfully fetched cart items",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error on cart GET", error.message);

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
