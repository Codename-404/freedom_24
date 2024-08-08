import { getDB } from "@/db/getDB";
import { HelpModel, UserModel } from "@/db/models";
import verifySession, { checkOrigin } from "@/util/serverUtilFunc";
import { D1Orm } from "d1-orm";
import { NextResponse } from "next/server";

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

  res = await helpModel.CreateTable({ strategy: "force" });
  res = await userModel.CreateTable({ strategy: "force" });

  const qur = `CREATE INDEX IF NOT EXISTS helpdata_added ON helpdata(added_at)`;
  const qur1 = `CREATE INDEX IF NOT EXISTS helpdata_ip ON helpdata(victim_email)`;
  const qur2 = `CREATE INDEX IF NOT EXISTS helpdata_id ON helpdata(id)`;

  res = await orm.prepare(qur).run();
  res = await orm.prepare(qur1).run();
  res = await orm.prepare(qur2).run();

  const user_qur = `CREATE INDEX IF NOT EXISTS user_email ON users(email)`;
  res = await orm.prepare(user_qur).run();

  return new Response(JSON.stringify(res), { status: 200 });
}
