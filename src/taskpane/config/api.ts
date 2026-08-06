export const API_BASE_URL = "http://localhost:5000/api";

export const API_ENDPOINTS = {
  health: "/health",
  contacts: "/hubspot/contacts",
  companies: "/hubspot/companies",
  deals: "/hubspot/deals",
  owners: "/hubspot/owners",
  dealPipelines: "/hubspot/pipelines/deals",
} as const;