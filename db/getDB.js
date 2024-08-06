import { getServerHost } from "@/util/serverUtilFunc";
import { binding } from "cf-bindings-proxy";

export const getDB = () => {
  const { host } = getServerHost();

  const subDomain = host.split(".")[0];

  let dbName = null;

  switch (subDomain) {
    case "dev": {
      dbName = process.env.DEV_DB;
      break;
    }
    case "show": {
      dbName = process.env.SHOW_DB;
      break;
    }

    default: {
      dbName = process.env.DB;
      break;
    }
  }

  return binding("DB") || dbName;
};
