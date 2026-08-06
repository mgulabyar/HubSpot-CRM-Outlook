import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Alert,
  Box,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import ContactForm, {
  type ContactFormValues,
} from "./ContactForm";
import ContactList from "./ContactList";
import {
  createContact,
  getContacts,
} from "../../services/hubspotApi";
import type { HubSpotRecord } from "../../types/hubspot";
import { getApiErrorMessage } from "../../utils/apiError";

const HUBSPOT_BRAND = {
  primary: "#ff7a59",
  charcoal: "#2d3e50",
  border: "#cbd6e2",
};

function splitFullName(fullName: string) {
  const nameParts = fullName.trim().split(/\s+/);

  return {
    firstname: nameParts[0] || "",
    lastname: nameParts.slice(1).join(" "),
  };
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<
    HubSpotRecord[]
  >([]);

  const [notesByContact, setNotesByContact] =
    useState<Record<string, HubSpotRecord | null>>({});

  const [loadingContacts, setLoadingContacts] =
    useState(true);

  const [savingContact, setSavingContact] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadContacts = useCallback(async () => {
    try {
      setLoadingContacts(true);
      setError("");

      const response = await getContacts(20);
      setContacts(response.results);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoadingContacts(false);
    }
  }, []);

  useEffect(() => {
    void loadContacts();
  }, [loadContacts]);

  const handleCreateContact = async (
    values: ContactFormValues
  ) => {
    try {
      setSavingContact(true);
      setError("");
      setSuccess("");

      const name = splitFullName(values.name);

      const result = await createContact({
        firstname: name.firstname,
        lastname: name.lastname,
        email: values.email.trim(),
        phone: "",
        company: values.company.trim(),
        subject: values.subject.trim(),
        notes: values.notes.trim(),
      });

      if (result.note && result.contact?.id) {
        setNotesByContact((previous) => ({
          ...previous,
          [result.contact.id]: result.note,
        }));
      }

      setSuccess(
        "Contact and CRM note saved successfully."
      );

      await loadContacts();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setSavingContact(false);
    }
  };

  const handleFindContact = async (email: string) => {
    try {
      setError("");
      setSuccess("");

      const response = await getContacts(100);

      const matchedContact = response.results.find(
        (contact) =>
          contact.properties.email?.toLowerCase() ===
          email.toLowerCase()
      );

      if (!matchedContact) {
        setError(
          "No contact found with this email address."
        );
        return;
      }

      setSuccess("Contact found successfully in HubSpot.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  };

  return (
    <Stack spacing={2}>
      <Box>
        <Typography
          variant="subtitle1"
          sx={{
            color: "#1e2a3c",
            fontWeight: 700,
          }}
        >
          Contacts
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: "#64748b",
            display: "block",
            mt: 0.4,
          }}
        >
          Create and find HubSpot contacts from Outlook.
        </Typography>
      </Box>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Chip
          label="CRM Connected"
          size="small"
          variant="outlined"
          sx={{
            color: HUBSPOT_BRAND.primary,
            borderColor:
              "rgba(255, 122, 89, 0.3)",
            bgcolor:
              "rgba(255, 122, 89, 0.08)",
            fontSize: "11px",
            fontWeight: 600,
          }}
        />

        <Chip
          label={`${contacts.length} Contacts`}
          size="small"
          variant="outlined"
          sx={{
            color: HUBSPOT_BRAND.charcoal,
            borderColor:
              "rgba(45, 62, 80, 0.2)",
            bgcolor:
              "rgba(45, 62, 80, 0.06)",
            fontSize: "11px",
            fontWeight: 600,
          }}
        />
      </Stack>

      <Divider
        sx={{
          borderColor: HUBSPOT_BRAND.border,
        }}
      />

      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{
            borderRadius: "4px",
            fontSize: "12px",
          }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          onClose={() => setSuccess("")}
          sx={{
            borderRadius: "4px",
            fontSize: "12px",
          }}
        >
          {success}
        </Alert>
      )}

      <ContactForm
        loading={savingContact}
        onSubmit={handleCreateContact}
        onFindContact={handleFindContact}
      />

      <Divider
        sx={{
          borderColor: HUBSPOT_BRAND.border,
        }}
      />

      <Box>
        <Typography
          variant="subtitle2"
          sx={{
            color: "#1e2a3c",
            fontWeight: 700,
            mb: 1.2,
          }}
        >
          Recent Contacts
        </Typography>

        <ContactList
          contacts={contacts}
          notesByContact={notesByContact}
          loading={loadingContacts}
        />
      </Box>
    </Stack>
  );
}