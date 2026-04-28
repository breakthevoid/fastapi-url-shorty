import {Link} from "../interfaces/Link";

const HOST = "http://localhost:8000";

export async function fetchLinks() {
  const response = await fetch(HOST + "/links/", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
}


export async function createLink(newLink: Link) {
  const response = await fetch(HOST + "/links/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newLink), // newItem should match the Item structure
  });
  return response.json();
}
