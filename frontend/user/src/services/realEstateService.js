import axios from "axios";
import { ENDPOINT } from "../environment";

export function listRealEstate(query) {
  return axios.get(`${ENDPOINT.REAL_ESTATE_ENDPOINT}/?${query ? query : ""}`)
}

export function getRealEstateById(reId) {
  return axios.get(`${ENDPOINT.REAL_ESTATE_ENDPOINT}/${reId}`);
}
