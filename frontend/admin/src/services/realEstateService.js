import axios from "axios";
import { ENDPOINT } from "../environment";

export function listRealEstate(offset) {
  return axios.get(`${ENDPOINT.REAL_ESTATE_ENDPOINT}?offset=${offset || 0}`);
}

export function createRealEstate(token, re) {
  return axios.post(`${ENDPOINT.REAL_ESTATE_ENDPOINT}`, re, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export function addRealEstateImage(token, reId, image) {
  return axios.post(
    `${ENDPOINT.REAL_ESTATE_ENDPOINT}/image/${reId}`, 
    image,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export function deleteRealEstate(token, reId) {
  return axios.delete(`${ENDPOINT.REAL_ESTATE_ENDPOINT}/${reId}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
}

export function getRealEstateById(reId) {
  return axios.get(`${ENDPOINT.REAL_ESTATE_ENDPOINT}/${reId}`);
}

export function removeRealEstateImage(token, imageId) {
  return axios.delete(`${ENDPOINT.REAL_ESTATE_ENDPOINT}/image/${imageId}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
}

export function updateRealEstate(token, reId, re) {
  return axios.put(`${ENDPOINT.REAL_ESTATE_ENDPOINT}/${reId}`, re, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
}
