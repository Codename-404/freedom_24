import { getDB } from "@/db/getDB";
import { HelpModel } from "@/db/models";
import { D1Orm } from "d1-orm";

export const runtime = "edge";

export async function GET(request) {
  let res = null;

  console.log("coming getDB()", getDB());

  const orm = new D1Orm(getDB());
  const helpModel = HelpModel(orm);
  console.log("helpModel", helpModel);

  res = await helpModel.CreateTable({ strategy: "force" });

  const qur = `CREATE INDEX IF NOT EXISTS helpdata_added ON helpdata(added_at)`;
  const qur1 = `CREATE INDEX IF NOT EXISTS helpdata_ip ON helpdata(victim_ip)`;
  const qur2 = `CREATE INDEX IF NOT EXISTS helpdata_id ON helpdata(id)`;

  res = await orm.prepare(qur).run();
  res = await orm.prepare(qur1).run();
  res = await orm.prepare(qur2).run();

  return new Response(JSON.stringify(res), { status: 200 });
}
