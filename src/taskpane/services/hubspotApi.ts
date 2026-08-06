import axios from "axios";
import {
  API_BASE_URL,
  API_ENDPOINTS,
} from "../config/api";
import {
  CompanyFormData,
  ContactFormData,
  DealFormData,
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

export const getContacts = async (limit = 10) => {
  const response = await hubspotApi.get<
    HubSpotApiResponse<HubSpotListResponse<HubSpotRecord>>
  >(API_ENDPOINTS.contacts, {
    params: { limit },
  });

  return response.data.data;
};
export const createContact = async (
  payload: ContactFormData
) => {
  const response = await hubspotApi.post<
    HubSpotApiResponse<{
      contact: HubSpotRecord;
      note: HubSpotRecord | null;
    }>
  >(API_ENDPOINTS.contacts, payload);

  return response.data.data;
};

export const getCompanies = async (limit = 10) => {
  const response = await hubspotApi.get<
    HubSpotApiResponse<HubSpotListResponse<HubSpotRecord>>
  >(API_ENDPOINTS.companies, {
    params: { limit },
  });

  return response.data.data;
};

export const createCompany = async (payload: CompanyFormData) => {
  const response = await hubspotApi.post<
    HubSpotApiResponse<HubSpotRecord>
  >(API_ENDPOINTS.companies, payload);

  return response.data.data;
};

export const getDeals = async (limit = 10) => {
  const response = await hubspotApi.get<
    HubSpotApiResponse<HubSpotListResponse<HubSpotRecord>>
  >(API_ENDPOINTS.deals, {
    params: { limit },
  });

  return response.data.data;
};

export const createDeal = async (payload: DealFormData) => {
  const response = await hubspotApi.post<
    HubSpotApiResponse<HubSpotRecord>
  >(API_ENDPOINTS.deals, payload);

  return response.data.data;
};

export const checkBackendHealth = async () => {
  const response = await hubspotApi.get<
    HubSpotApiResponse<{
      message: string;
    }>
  >(API_ENDPOINTS.health);

  return response.data.data;
};