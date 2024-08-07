export const textInputTypes = {
  text: "text",
  number: "number",
  textarea: "textarea",
};

export const helpKeys = {
  id: "id",
  name: "name",
  details: "details",
  phone: "phone",
  lat: "lat",
  lon: "lon",
  views: "views",
  victim_ip: "victim_ip",
  added_at: "added_at",
};

export function makeQueryStringUrl(url, obj) {
  const keyValuePairs = [];
  for (const key in obj) {
    keyValuePairs.push(
      encodeURIComponent(key) + "=" + encodeURIComponent(obj[key])
    );
  }
  const fullUrl = url + "?" + keyValuePairs.join("&");

  return fullUrl;
}

export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}
