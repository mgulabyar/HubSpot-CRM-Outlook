import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config/api";
import {
  ContactCreateResponse,
  ContactFormData,
  ContactUpdateData,
  ContactUpdateResponse,
  HubSpotApiResponse,
  HubSpotListResponse,
  HubSpotRecord,
} from "../types/hubspot";

const hubspotApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getContacts = async (limit = 20) => {
  const response = await hubspotApi.get<HubSpotApiResponse<HubSpotListResponse<HubSpotRecord>>>(
    API_ENDPOINTS.contacts,
    {
      params: {
        limit,
      },
    }
  );

  return response.data.data;
};

export const getContact = async (contactId: string) => {
  const response = await hubspotApi.get<HubSpotApiResponse<HubSpotRecord>>(
    `${API_ENDPOINTS.contacts}/${contactId}`
  );

  return response.data.data;
};

export const getContactNotes = async (contactId: string) => {
  const response = await hubspotApi.get<HubSpotApiResponse<HubSpotListResponse<HubSpotRecord>>>(
    `${API_ENDPOINTS.contacts}/${contactId}/notes`
  );

  return response.data.data;
};

export const createContact = async (payload: ContactFormData) => {
  const response = await hubspotApi.post<HubSpotApiResponse<ContactCreateResponse>>(
    API_ENDPOINTS.contacts,
    payload
  );

  return response.data.data;
};

export const updateContact = async (contactId: string, payload: ContactUpdateData) => {
  const response = await hubspotApi.patch<HubSpotApiResponse<ContactUpdateResponse>>(
    `${API_ENDPOINTS.contacts}/${contactId}`,
    payload
  );

  return response.data.data;
};

export const deleteContact = async (contactId: string) => {
  const cleanId = String(contactId).trim();

  if (!cleanId) {
    throw new Error("Contact ID is missing.");
  }

  const response = await hubspotApi.delete(
    `${API_ENDPOINTS.contacts}/${encodeURIComponent(cleanId)}`
  );

  return {
    status: response.status,
    data: response.data,
  };
};
