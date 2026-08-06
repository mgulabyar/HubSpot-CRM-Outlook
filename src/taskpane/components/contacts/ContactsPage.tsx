import React, { useCallback, useEffect, useState } from "react";
import { Alert, Box, Chip, Divider, Snackbar, Stack, Typography } from "@mui/material";
import ContactForm, { type ContactFormValues } from "./ContactForm";
import ContactList from "./ContactList";
import {
  createContact,
  deleteContact,
  getContactNotes,
  getContacts,
} from "../../services/hubspotApi";
import type { HubSpotRecord } from "../../types/hubspot";
import { getApiErrorMessage } from "../../utils/apiError";

const HUBSPOT_BRAND = {
  primary: "#ff7a59",
  charcoal: "#2d3e50",
  border: "#cbd6e2",
};

type ToastSeverity = "success" | "error" | "info" | "warning";

function splitFullName(fullName: string) {
  const nameParts = fullName.trim().split(/\s+/);

  return {
    firstname: nameParts[0] || "",
    lastname: nameParts.slice(1).join(" "),
  };
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<HubSpotRecord[]>([]);

  const [notesByContact, setNotesByContact] = useState<Record<string, HubSpotRecord | null>>({});

  const [loadingContacts, setLoadingContacts] = useState(true);

  const [savingContact, setSavingContact] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: ToastSeverity;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = useCallback((message: string, severity: ToastSeverity) => {
    setToast({
      open: true,
      message,
      severity,
    });
  }, []);

  const closeToast = () => {
    setToast((previous) => ({
      ...previous,
      open: false,
    }));
  };

  const loadContactNotes = useCallback(async (loadedContacts: HubSpotRecord[]) => {
    const notesEntries = await Promise.all(
      loadedContacts.map(async (contact) => {
        try {
          const notesResponse = await getContactNotes(contact.id);

          const notes = notesResponse.results || [];

          if (notes.length === 0) {
            return [contact.id, null] as const;
          }

          const latestNote = [...notes].sort((first, second) => {
            const firstDate =
              first.properties?.hs_timestamp || first.updatedAt || first.createdAt || "";

            const secondDate =
              second.properties?.hs_timestamp || second.updatedAt || second.createdAt || "";

            return new Date(secondDate).getTime() - new Date(firstDate).getTime();
          })[0];

          return [contact.id, latestNote] as const;
        } catch {
          return [contact.id, null] as const;
        }
      })
    );

    setNotesByContact(Object.fromEntries(notesEntries));
  }, []);

  const loadContacts = useCallback(async () => {
    try {
      setLoadingContacts(true);

      const response = await getContacts(20);
      const loadedContacts = response.results || [];

      setContacts(loadedContacts);

      await loadContactNotes(loadedContacts);
    } catch (requestError) {
      showToast(getApiErrorMessage(requestError), "error");
    } finally {
      setLoadingContacts(false);
    }
  }, [loadContactNotes, showToast]);

  useEffect(() => {
    void loadContacts();
  }, [loadContacts]);

  const handleCreateContact = async (values: ContactFormValues): Promise<boolean> => {
    try {
      setSavingContact(true);

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

      await loadContacts();

      showToast("Contact created successfully.", "success");

      return true;
    } catch (requestError) {
      showToast(getApiErrorMessage(requestError), "error");

      return false;
    } finally {
      setSavingContact(false);
    }
  };

  const handleFindContact = async (email: string): Promise<void> => {
    try {
      const response = await getContacts(100);

      const matchedContact = response.results.find(
        (contact) => contact.properties.email?.toLowerCase() === email.toLowerCase()
      );

      if (!matchedContact) {
        showToast("No contact found with this email address.", "warning");
        return;
      }

      showToast("Contact found successfully in HubSpot.", "success");
    } catch (requestError) {
      showToast(getApiErrorMessage(requestError), "error");
    }
  };

  const handleDeleteContact = async (contactId: string): Promise<void> => {
    const confirmed = window.confirm("Are you sure you want to delete this contact?");

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(contactId);

      await deleteContact(contactId);

      setContacts((previous) => previous.filter((contact) => contact.id !== contactId));

      setNotesByContact((previous) => {
        const updated = { ...previous };
        delete updated[contactId];
        return updated;
      });

      showToast("Contact deleted successfully.", "success");
    } catch (requestError) {
      showToast(getApiErrorMessage(requestError), "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
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
              borderColor: "rgba(255, 122, 89, 0.3)",
              bgcolor: "rgba(255, 122, 89, 0.08)",
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
              borderColor: "rgba(45, 62, 80, 0.2)",
              bgcolor: "rgba(45, 62, 80, 0.06)",
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
            deletingId={deletingId}
            onDelete={handleDeleteContact}
          />
        </Box>
      </Stack>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={closeToast}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          zIndex: 2000,
        }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={closeToast}
          sx={{
            width: "100%",
            fontSize: "12px",
            borderRadius: "4px",
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
