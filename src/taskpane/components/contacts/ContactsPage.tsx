import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import ContactForm from "./ContactForm";
import ContactEditDialog from "./ContactEditDialog";
import ContactList from "./ContactList";
import {
  createContact,
  deleteContact,
  getContactNotes,
  getContacts,
  updateContact,
} from "../../services/hubspotApi";
import type { ContactFormValues, HubSpotRecord } from "../../types/hubspot";
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

function getLatestNote(notes: HubSpotRecord[]) {
  if (notes.length === 0) {
    return null;
  }

  return [...notes].sort((first, second) => {
    const firstDate = first.properties?.hs_timestamp || first.updatedAt || first.createdAt || "";

    const secondDate =
      second.properties?.hs_timestamp || second.updatedAt || second.createdAt || "";

    return new Date(secondDate).getTime() - new Date(firstDate).getTime();
  })[0];
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<HubSpotRecord[]>([]);

  const [notesByContact, setNotesByContact] = useState<Record<string, HubSpotRecord | null>>({});

  const [loadingContacts, setLoadingContacts] = useState(true);

  const [savingContact, setSavingContact] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editingContact, setEditingContact] = useState<HubSpotRecord | null>(null);

  const [editingNote, setEditingNote] = useState<HubSpotRecord | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [pendingDeleteContact, setPendingDeleteContact] = useState<HubSpotRecord | null>(null);

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
    const noteEntries = await Promise.all(
      loadedContacts.map(async (contact) => {
        try {
          const response = await getContactNotes(contact.id);

          const latestNote = getLatestNote(response.results || []);

          return [contact.id, latestNote] as const;
        } catch {
          return [contact.id, null] as const;
        }
      })
    );

    const notesMap: Record<string, HubSpotRecord | null> = {};

    noteEntries.forEach(([contactId, note]) => {
      notesMap[contactId] = note;
    });

    setNotesByContact(notesMap);
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

      await createContact({
        firstname: name.firstname,
        lastname: name.lastname,
        email: values.email.trim(),
        phone: "",
        company: values.company.trim(),
        subject: values.subject.trim(),
        notes: values.notes.trim(),
      });

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

  const handleOpenEdit = (contactId: string) => {
    const selectedContact = contacts.find((contact) => contact.id === contactId);

    if (!selectedContact) {
      return;
    }

    setEditingContact(selectedContact);
    setEditingNote(notesByContact[selectedContact.id] || null);
    setEditDialogOpen(true);
  };

  const handleCloseEdit = () => {
    if (savingContact) {
      return;
    }

    setEditDialogOpen(false);
    setEditingContact(null);
    setEditingNote(null);
  };

  const handleUpdateContact = async (values: ContactFormValues): Promise<boolean> => {
    if (!editingContact) {
      return false;
    }

    try {
      setSavingContact(true);

      const name = splitFullName(values.name);
      const currentNoteId = editingNote?.id;

      await updateContact(editingContact.id, {
        firstname: name.firstname,
        lastname: name.lastname,
        email: values.email.trim(),
        company: values.company.trim(),
        subject: values.subject.trim(),
        notes: values.notes.trim(),
        ...(currentNoteId ? { noteId: currentNoteId } : {}),
      });

      await loadContacts();

      setEditDialogOpen(false);
      setEditingContact(null);
      setEditingNote(null);

      showToast("Contact updated successfully.", "success");

      return true;
    } catch (requestError) {
      showToast(getApiErrorMessage(requestError), "error");

      return false;
    } finally {
      setSavingContact(false);
    }
  };

  const handleDeleteContact = async (contactId: string): Promise<void> => {
    console.log("[ContactsPage] delete requested:", contactId);

    const cleanId = String(contactId).trim();

    if (!cleanId) {
      console.error("[ContactsPage] empty contact ID");

      showToast("Contact ID missing.", "error");

      return;
    }

    const selectedContact = contacts.find((contact) => String(contact.id) === cleanId);

    if (!selectedContact) {
      console.error("[ContactsPage] contact not found for ID:", cleanId);

      showToast("Contact not found.", "error");

      return;
    }

    setPendingDeleteContact(selectedContact);
  };

  const handleCancelDelete = () => {
    if (deletingId) {
      return;
    }

    setPendingDeleteContact(null);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteContact) {
      return;
    }

    const cleanId = String(pendingDeleteContact.id).trim();

    try {
      setDeletingId(cleanId);

      console.log("[ContactsPage] calling deleteContact:", cleanId);

      const result = await deleteContact(cleanId);

      console.log("[ContactsPage] backend delete result:", result);

      setContacts((oldContacts) => {
        const newContacts = oldContacts.filter((contact) => String(contact.id) !== cleanId);

        console.log("[ContactsPage] updated contacts:", newContacts);

        return newContacts;
      });

      setNotesByContact((oldNotes) => {
        const newNotes = {
          ...oldNotes,
        };

        delete newNotes[cleanId];

        return newNotes;
      });

      showToast("Contact deleted successfully.", "success");
    } catch (error) {
      console.error("[ContactsPage] delete failed:", error);

      showToast(getApiErrorMessage(error), "error");
    } finally {
      setDeletingId(null);
      setPendingDeleteContact(null);

      console.log("[ContactsPage] delete handler finished:", cleanId);
    }
  };

  const pendingDeleteName = pendingDeleteContact
    ? [pendingDeleteContact.properties?.firstname, pendingDeleteContact.properties?.lastname]
        .filter(Boolean)
        .join(" ") ||
      pendingDeleteContact.properties?.email ||
      String(pendingDeleteContact.id)
    : "";

  return (
    <>
      <Stack spacing={1.5} sx={{ bgcolor: "#ffffff", minHeight: "100vh" }}>
        <ContactForm
          loading={savingContact}
          onSubmit={handleCreateContact}
          onFindContact={handleFindContact}
        />

        <Divider sx={{ borderColor: "#e2e8f0" }} />

        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.5,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: "#1e293b",
                fontWeight: 500,
                fontSize: "13px",
                letterSpacing: "0.2px",
              }}
            >
              Recent Contacts
            </Typography>

            <Chip
              label={`${contacts.length} Contacts`}
              size="small"
              variant="outlined"
              sx={{
                color: "#475569",
                borderColor: "#cbd5e1",
                bgcolor: "#f1f5f9",
                fontSize: "10.5px",
                fontWeight: 600,
                height: 24,
                borderRadius: "4px",
                px: 0.5,
              }}
            />
          </Box>

          <ContactList
            contacts={contacts}
            notesByContact={notesByContact}
            loading={loadingContacts}
            deletingId={deletingId}
            onDelete={handleDeleteContact}
            onEdit={handleOpenEdit}
          />
        </Box>
      </Stack>

      <ContactEditDialog
        open={editDialogOpen}
        contact={editingContact}
        note={editingNote}
        loading={savingContact}
        onClose={handleCloseEdit}
        onSave={handleUpdateContact}
      />

      <Dialog
        open={Boolean(pendingDeleteContact)}
        onClose={handleCancelDelete}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: "#ffffff",
              backgroundImage: "none",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            },
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "14.5px", fontWeight: 500, color: "#1e293b", pb: 1 }}>
          Delete contact
        </DialogTitle>

        <DialogContent sx={{ pb: 2 }}>
          <DialogContentText sx={{ fontSize: "12.5px", color: "#475569", lineHeight: 1.45 }}>
            Are you sure you want to delete{" "}
            <strong style={{ color: "#1e293b" }}>{pendingDeleteName}</strong>? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 1.5, pb: 1.5, gap: 0.5 }}>
          <Button
            onClick={handleCancelDelete}
            disabled={Boolean(deletingId)}
            sx={{
              textTransform: "none",
              fontSize: "12.5px",
              color: "#64748b",
              fontWeight: 500,
              "&:hover": { bgcolor: "rgba(100, 116, 139, 0.08)" },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleConfirmDelete}
            disabled={Boolean(deletingId)}
            variant="contained"
            color="error"
            sx={{
              textTransform: "none",
              fontSize: "12.5px",
              fontWeight: 600,
              borderRadius: "6px",
              boxShadow: "none",
              bgcolor: "#dc2626",
              "&:hover": { bgcolor: "#b91c1c", boxShadow: "none" },
            }}
          >
            {deletingId ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

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
          variant="outlined"
          onClose={closeToast}
          sx={{
            width: "100%",
            fontSize: "12px",
            borderRadius: "6px",
            bgcolor: toast.severity === "error" ? "#fef2f2" : "#fffbeb",
            color: toast.severity === "error" ? "#b91c1c" : "#92400e",
            borderColor:
              toast.severity === "error" ? "rgba(239, 68, 68, 0.35)" : "rgba(217, 119, 6, 0.35)",
            "& .MuiAlert-icon": {
              color: toast.severity === "error" ? "#dc2626" : "#d97706",
            },
            "& .MuiAlert-action": {
              color: "#64748b",
            },
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
