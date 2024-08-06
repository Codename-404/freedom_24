import { getDB } from "@/db/getDB";
import { TestModel } from "@/db/models";
import { D1Orm } from "d1-orm";

export const runtime = "edge";

export async function GET(request) {
  let res = null;

  const orm = new D1Orm(getDB());
  const tempModel = TestModel(orm);

  //   res = await tempModel.CreateTable({ strategy: "force" });

  const qur = `CREATE INDEX IF NOT EXISTS test_value ON testdata(value)`;

  res = await orm.prepare(qur).run();

  return new Response(JSON.stringify(res), { status: 200 });
}
