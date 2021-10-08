import axios from "axios";

export default () => {
  let defaultURL = "";
  const currentLocation = window.location.origin;
  if (currentLocation.includes("production")) {
    defaultURL = "https://ota-update-v2-jx-production.jenkins-x-viettel.iviet.com";
  } else if (currentLocation.includes("staging")) {
    defaultURL = "https://ota-update-v2-jx-staging.jenkins-x-viettel.iviet.com";
  } else {
    defaultURL = "https://ota-update-v2-jx-staging.jenkins-x-viettel.iviet.com";
  }
  console.log("currentLocation", currentLocation);
  console.log("api link", defaultURL);

  return axios.create({
    baseURL: defaultURL,

    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};
