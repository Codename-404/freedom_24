import { cookies, headers } from "next/headers";
import jwt from "@tsndr/cloudflare-worker-jwt";

export function getServerHost() {
  const headersList = headers();
  const host = headersList.get("host");
  const proto = headersList.get("x-forwarded-proto");

  const hostname = `${proto}://${host}`;

  return { host, hostname };
}

export function getBoundingBox(latitude, longitude, radius) {
  const R = 6371; // Radius of the Earth in kilometers
  const lat = (latitude * Math.PI) / 180; // Convert latitude to radians
  const lon = (longitude * Math.PI) / 180; // Convert longitude to radians
  const radiusInRad = radius / R; // Convert radius from km to radians

  // Calculate min and max latitudes
  const minLat = latitude - (radiusInRad * 180) / Math.PI;
  const maxLat = latitude + (radiusInRad * 180) / Math.PI;

  // Calculate min and max longitudes
  const minLon = longitude - (radiusInRad * 180) / Math.PI / Math.cos(lat);
  const maxLon = longitude + (radiusInRad * 180) / Math.PI / Math.cos(lat);

  return {
    latMin: minLat,
    latMax: maxLat,
    lonMin: minLon,
    lonMax: maxLon,
  };
}

export default async function verifySession() {
  // get the jwtToken from the cookies
  const jwtToken = cookies().get("jwtToken");

  // if the jwtToken is not found or the value of the jwtToken is empty
  if (!jwtToken || (jwtToken && jwtToken.value && jwtToken.value.length <= 0)) {
    // log the error
    console.log("jwtToken not found", jwtToken);
    // return an object with the data and success set to false and a message
    return {
      data: null,
      success: false,
      message: `Token not found`,
    };
  }

  try {
    if (process.env.BUILD_ENVIRONMENT !== "DEVELOPMENT") {
      // verify the token
      const isTokenValid = await jwt.verify(
        jwtToken.value,
        process.env.AUTH_SECRET
      );

      // if the token is not valid
      if (!isTokenValid) {
        // return an object with the data and success set to false and a message
        return {
          data: null,
          success: false,
          message: `Session is not valid`,
        };
      }
    }

    // if the token is valid

    // decode the token
    const { payload: tokenData } = jwt.decode(jwtToken.value);

    // if the token has expired
    if (tokenData.expires < Date.now()) {
      // Token expired

      // return an object with the data and success set to false and a message
      return {
        data: null,
        success: false,
        message: `Session expired`,
      };
    }

    // return an object with the data, success set to true and a message
    return {
      data: tokenData,
      success: true,
      message: `Session is valid`,
    };
  } catch (error) {
    // log the error
    console.log("verify error", error.message);
    // return an object with the data and success set to false and a message
    return {
      data: null,
      success: false,
      message: `Something went wrong`,
    };
  }
}

const allowedOrigins = ["localhost:3000", "dakatdhor.com"];

export function checkOrigin(request) {
  const url = new URL(request.url);
  const origin = headers().get("origin") || url.origin;
  if (!origin) {
    console.log("retunring error as origin is not valid", url.origin);
    return false;
  }

  let originMatched = null;
  const originUrl = new URL(origin);
  for (let i = 0; i < allowedOrigins.length; i++) {
    if (allowedOrigins[i] === originUrl.host) {
      originMatched = originUrl.host;
      break;
    }
  }

  if (!originMatched) {
    console.log("origin did not match", origin);
    return false;
  }

  return true;
}
