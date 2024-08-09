import { getDB } from "@/db/getDB";
import { HelpModel, UserModel } from "@/db/models";
import verifySession, { checkOrigin } from "@/util/serverUtilFunc";
import { D1Orm } from "d1-orm";
import { NextResponse } from "next/server";
import { v4 } from "uuid";

export const runtime = "edge";

export async function GET(request) {
  const originCheck = checkOrigin(request);
  if (!originCheck) {
    return new Response("Forbidden", { status: 403 });
  }

  // const sessionDataRes = await verifySession();
  // if (!sessionDataRes.success) {
  //   return NextResponse.json(sessionDataRes);
  // }

  let res = null;

  const orm = new D1Orm(getDB());
  const helpModel = HelpModel(orm);
  const userModel = UserModel(orm);

  const reqs = [];
  const time = Date.now();
  for (let i = 0; i < 50; i++) {
    reqs.push(
      helpModel.InsertOne({
        id: v4(),
        name: `victim_${i}`,
        lat: (Math.random() * 990000) / 10000,
        lon: (Math.random() * 990000) / 10000,
        victim_email: `victim_${i}@gmail.com`,
        victim_ip: v4(),
        added_at: time + (Math.random() > 0.5 ? 1 : -1) * Math.random() * 1000,
      })
    );
  }

  res = await Promise.all(reqs);

  // res = await helpModel.CreateTable({ strategy: "force" });
  // res = await userModel.CreateTable({ strategy: "force" });

  // const qur = `CREATE INDEX IF NOT EXISTS helpdata_added ON helpdata(added_at)`;
  // const qur1 = `CREATE INDEX IF NOT EXISTS helpdata_ip ON helpdata(victim_email)`;
  // const qur2 = `CREATE INDEX IF NOT EXISTS helpdata_id ON helpdata(id)`;

  // res = await orm.prepare(qur).run();
  // res = await orm.prepare(qur1).run();
  // res = await orm.prepare(qur2).run();

  // const user_qur = `CREATE INDEX IF NOT EXISTS user_email ON users(email)`;
  // res = await orm.prepare(user_qur).run();

  return new Response(JSON.stringify(res), { status: 200 });
}
