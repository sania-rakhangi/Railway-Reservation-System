export async function postData(url, data, auth = false) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
  }

  const response = await fetch(`${API_URL}${url}`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function getData(url, auth = false) {
  const headers = {};
  if (auth) {
    headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
  }

  const response = await fetch(`${API_URL}${url}`, {
    method: "GET",
    headers,
  });
  return response.json();
}
