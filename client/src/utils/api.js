const baseUrl = "http://localhost:5000/api";

export const postData = async (url, data, auth = false) => {
  const headers = {
    "Content-Type": "application/json",
  };
  if (auth) {
    headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
  }
  const response = await fetch(`${baseUrl}${url}`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  return await response.json();
};

export const getData = async (url, auth = false) => {
  const headers = {};
  if (auth) {
    headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
  }
  const response = await fetch(`${baseUrl}${url}`, {
    method: "GET",
    headers,
  });
  return await response.json();
};
