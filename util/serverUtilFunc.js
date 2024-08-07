import { headers } from "next/headers";

export function getServerHost() {
  const headersList = headers();
  const host = headersList.get("host");
  const proto = headersList.get("x-forwarded-proto");

  const hostname = `${proto}://${host}`;
  console.log("coming host is host", { host, hostname });

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

  console.log("calculated bounding box", {
    input: { latitude, longitude, radius },
    minLat,
    maxLat,
    minLon,
    maxLon,
  });

  return {
    latMin: minLat,
    latMax: maxLat,
    lonMin: minLon,
    lonMax: maxLon,
  };
}
