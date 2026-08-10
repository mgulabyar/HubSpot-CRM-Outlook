import axios from "axios";
import {
  API_BASE_URL,
  API_ENDPOINTS,
} from "../config/api";

import type {
  AssociationApiResponse,
  AssociationFormValues,
  AssociationListResponse,
} from "../types/AssociationModels";

const associationApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

function cleanId(value: string) {
  return String(value || "")
    .replace(/\s+/g, "")
    .trim();
}

function getErrorMessage(
  error: unknown
): string {
  if (!axios.isAxiosError(error)) {
    if (error instanceof Error) {
      return error.message;
    }

    return "Association request failed.";
  }

  const data = error.response?.data;

  console.error(
    "[AssociationApi] status:",
    error.response?.status
  );

  console.error(
    "[AssociationApi] data:",
    data
  );

  if (
    typeof data?.message === "string" &&
    data.message.trim()
  ) {
    return data.message;
  }

  if (
    typeof data?.raw?.message === "string"
  ) {
    return data.raw.message;
  }

  if (
    typeof data?.error?.message === "string"
  ) {
    return data.error.message;
  }

  if (Array.isArray(data?.errors)) {
    const firstError = data.errors[0];

    if (firstError?.message) {
      return firstError.message;
    }
  }

  if (error.response?.status) {
    return `Association request failed with status ${error.response.status}.`;
  }

  return error.message;
}

function throwError(error: unknown): never {
  const message = getErrorMessage(error);

  console.error(
    "[AssociationApi] final error:",
    message
  );

  throw new Error(message);
}

export const fetchAssociations = async (
  fromType: string,
  fromId: string,
  toType: string
): Promise<AssociationListResponse> => {
  try {
    const cleanFromId = cleanId(fromId);

    if (!cleanFromId) {
      throw new Error(
        "Source record ID is required."
      );
    }

    if (!/^[0-9]+$/.test(cleanFromId)) {
      throw new Error(
        "Source record ID must contain numbers only."
      );
    }

    const endpoint =
      `${API_ENDPOINTS.associations}/` +
      `${encodeURIComponent(fromType)}/` +
      `${encodeURIComponent(cleanFromId)}/` +
      `${encodeURIComponent(toType)}`;

    console.log(
      "[AssociationApi] GET:",
      `${API_BASE_URL}${endpoint}`
    );

    const response = await associationApi.get<
      AssociationApiResponse<AssociationListResponse>
    >(endpoint);

    return response.data.data;
  } catch (error) {
    throwError(error);
  }
};

export const createAssociation = async (
  payload: AssociationFormValues
) => {
  try {
    const cleanPayload = {
      fromType: payload.fromType,
      fromId: cleanId(payload.fromId),
      toType: payload.toType,
      toId: cleanId(payload.toId),
    };

    if (!cleanPayload.fromId) {
      throw new Error(
        "Source record ID is required."
      );
    }

    if (!cleanPayload.toId) {
      throw new Error(
        "Target record ID is required."
      );
    }

    if (
      !/^[0-9]+$/.test(cleanPayload.fromId)
    ) {
      throw new Error(
        "Source record ID must contain numbers only."
      );
    }

    if (
      !/^[0-9]+$/.test(cleanPayload.toId)
    ) {
      throw new Error(
        "Target record ID must contain numbers only."
      );
    }

    if (
      cleanPayload.fromType ===
        cleanPayload.toType &&
      cleanPayload.fromId === cleanPayload.toId
    ) {
      throw new Error(
        "A record cannot be associated with itself."
      );
    }

    console.log(
      "[AssociationApi] POST payload:",
      cleanPayload
    );

    const response = await associationApi.post(
      API_ENDPOINTS.associations,
      cleanPayload
    );

    console.log(
      "[AssociationApi] POST response:",
      response.status,
      response.data
    );

    return response.data;
  } catch (error) {
    throwError(error);
  }
};

export const deleteAssociation = async (
  payload: AssociationFormValues
) => {
  try {
    const cleanPayload = {
      fromType: payload.fromType,
      fromId: cleanId(payload.fromId),
      toType: payload.toType,
      toId: cleanId(payload.toId),
    };

    const response = await associationApi.delete(
      API_ENDPOINTS.associations,
      {
        data: cleanPayload,
      }
    );

    return response.data;
  } catch (error) {
    throwError(error);
  }
};