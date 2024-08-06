import { headers } from "next/headers";

export function getServerHost() {
  const headersList = headers();
  const host = headersList.get("host");
  const proto = headersList.get("x-forwarded-proto");

  const hostname = `${proto}://${host}`;
  console.log("coming host is host", { host, hostname });

  return { host, hostname };
}
