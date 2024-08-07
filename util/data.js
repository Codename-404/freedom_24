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
