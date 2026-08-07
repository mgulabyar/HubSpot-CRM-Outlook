import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import type {
  ContactFormValues,
  HubSpotRecord,
} from "../../types/hubspot";

type ContactEditDialogProps = {
  open: boolean;
  contact: HubSpotRecord | null;
  note: HubSpotRecord | null;
  loading: boolean;
  onClose: () => void;
  onSave: (
    values: ContactFormValues
  ) => Promise<boolean>;
};

const emptyForm: ContactFormValues = {
  name: "",
  email: "",
  company: "",
  subject: "",
  notes: "",
};

function getNoteValues(
  note: HubSpotRecord | null
) {
  const body = note?.properties?.hs_note_body || "";

  const subjectMatch = body.match(
    /^Subject Line:\s*(.*)$/m
  );

  const notesMatch = body.match(
    /^Internal Notes:\s*([\s\S]*)$/m
  );

  return {
    subject: subjectMatch?.[1]?.trim() || "",
    notes: notesMatch?.[1]?.trim() || "",
  };
}

export default function ContactEditDialog({
  open,
  contact,
  note,
  loading,
  onClose,
  onSave,
}: ContactEditDialogProps) {
  const [form, setForm] =
    useState<ContactFormValues>(emptyForm);

  useEffect(() => {
    if (!contact) {
      setForm(emptyForm);
      return;
    }

    const firstName =
      contact.properties.firstname || "";
    const lastName =
      contact.properties.lastname || "";
    const noteValues = getNoteValues(note);

    setForm({
      name: `${firstName} ${lastName}`.trim(),
      email: contact.properties.email || "",
      company: contact.properties.company || "",
      subject: noteValues.subject,
      notes: noteValues.notes,
    });
  }, [contact, note]);

  const handleChange =
    (field: keyof ContactFormValues) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >
    ) => {
      setForm((previous) => ({
        ...previous,
        [field]: event.target.value,
      }));
    };

  const handleSave = async () => {
    const successful = await onSave(form);

    if (successful) {
      setForm(emptyForm);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle
        sx={{
          color: "#1e2a3c",
          fontWeight: 700,
          fontSize: "18px",
        }}
      >
        Edit Contact
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            fullWidth
            size="small"
            label="Full Name"
            value={form.name}
            onChange={handleChange("name")}
          />

          <TextField
            fullWidth
            size="small"
            type="email"
            label="Email Address"
            value={form.email}
            onChange={handleChange("email")}
          />

          <TextField
            fullWidth
            size="small"
            label="Company Name"
            value={form.company}
            onChange={handleChange("company")}
          />

          <TextField
            fullWidth
            size="small"
            label="Subject Line"
            value={form.subject}
            onChange={handleChange("subject")}
          />

          <TextField
            fullWidth
            size="small"
            multiline
            minRows={3}
            label="Internal Notes"
            value={form.notes}
            onChange={handleChange("notes")}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            textTransform: "none",
            color: "#2d3e50",
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={() => {
            void handleSave();
          }}
          disabled={loading}
          sx={{
            textTransform: "none",
            bgcolor: "#ff7a59",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#ea6541",
              boxShadow: "none",
            },
          }}
        >
          {loading ? "Updating..." : "Update Contact"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}