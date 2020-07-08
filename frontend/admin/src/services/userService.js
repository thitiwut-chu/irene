import axios from "axios";
import { ENDPOINT } from "../environment";

export function logIn(username, password) {
  return axios.post(`${ENDPOINT.AUTH_ENDPOINT}/login`, { username, password });
}

export function logOut() {
  localStorage.removeItem("token");
}

export function checkTokenExpired(token) {
  return axios.get(`${ENDPOINT.AUTH_ENDPOINT}/check-token-expired`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  })
}
