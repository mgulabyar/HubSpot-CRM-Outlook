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
import type { ContactFormValues, HubSpotRecord } from "../../types/hubspot";

type ContactEditDialogProps = {
  open: boolean;
  contact: HubSpotRecord | null;
  note: HubSpotRecord | null;
  loading: boolean;
  onClose: () => void;
  onSave: (values: ContactFormValues) => Promise<boolean>;
};

const emptyForm: ContactFormValues = {
  name: "",
  email: "",
  company: "",
  subject: "",
  notes: "",
};

function getNoteValues(note: HubSpotRecord | null) {
  const body = note?.properties?.hs_note_body || "";

  const subjectMatch = body.match(/^Subject Line:\s*(.*)$/m);

  const notesMatch = body.match(/^Internal Notes:\s*([\s\S]*)$/m);

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
  const [form, setForm] = useState<ContactFormValues>(emptyForm);

  useEffect(() => {
    if (!contact) {
      setForm(emptyForm);
      return;
    }

    const firstName = contact.properties.firstname || "";
    const lastName = contact.properties.lastname || "";
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
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            bgcolor: "#ffffff",
            backgroundImage: "none",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            mx: 1.5,

            width: "calc(100% - 24px)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "#1e293b",
          fontWeight: 500,
          fontSize: "14.5px",
          pt: 2,
          px: 1.5,
          pb: 0.5,
        }}
      >
        Edit Contact
      </DialogTitle>

      <DialogContent
        sx={{
          px: 1.5,
          pb: 1.5,
        }}
      >
        <Stack spacing={2.2} sx={{ pt: 1.5 }}>
          <TextField
            fullWidth
            size="small"
            label="Full Name"
            value={form.name}
            onChange={handleChange("name")}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            sx={{
              "& .MuiInputLabel-root": {
                color: "#64748b",
                fontSize: "13px",
                fontWeight: 500,
                bgcolor: "#ffffff",
                px: 0.6,
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
              "& .MuiOutlinedInput-root": {
                color: "#1e293b",
                fontSize: "13px",
                bgcolor: "#fff",
                borderRadius: "6px",
                transition: "background-color 150ms ease",
                "& fieldset": { borderColor: "#cbd5e1" },
                "&:hover fieldset": { borderColor: "#94a3b8" },
                "&.Mui-focused": { bgcolor: "#ffffff" },
                "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
                "& input": { color: "#1e293b" },
              },
            }}
          />
          <TextField
            fullWidth
            size="small"
            type="email"
            label="Email Address"
            value={form.email}
            onChange={handleChange("email")}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            sx={{
              "& .MuiInputLabel-root": {
                color: "#64748b",
                fontSize: "13px",
                fontWeight: 500,
                bgcolor: "#ffffff",
                px: 0.6,
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
              "& .MuiOutlinedInput-root": {
                color: "#1e293b",
                fontSize: "13px",
                bgcolor: "#fff",
                borderRadius: "6px",
                transition: "background-color 150ms ease",
                "& fieldset": { borderColor: "#cbd5e1" },
                "&:hover fieldset": { borderColor: "#94a3b8" },
                "&.Mui-focused": { bgcolor: "#ffffff" },
                "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
                "& input": { color: "#1e293b" },
              },
            }}
          />
          <TextField
            fullWidth
            size="small"
            label="Company Name"
            value={form.company}
            onChange={handleChange("company")}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            sx={{
              "& .MuiInputLabel-root": {
                color: "#64748b",
                fontSize: "13px",
                fontWeight: 500,
                bgcolor: "#ffffff",
                px: 0.6,
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
              "& .MuiOutlinedInput-root": {
                color: "#1e293b",
                fontSize: "13px",
                bgcolor: "#fff",
                borderRadius: "6px",
                transition: "background-color 150ms ease",
                "& fieldset": { borderColor: "#cbd5e1" },
                "&:hover fieldset": { borderColor: "#94a3b8" },
                "&.Mui-focused": { bgcolor: "#ffffff" },
                "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
                "& input": { color: "#1e293b" },
              },
            }}
          />

          <TextField
            fullWidth
            size="small"
            label="Subject Line"
            value={form.subject}
            onChange={handleChange("subject")}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            sx={{
              "& .MuiInputLabel-root": {
                color: "#64748b",
                fontSize: "13px",
                fontWeight: 500,
                bgcolor: "#ffffff",
                px: 0.6,
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
              "& .MuiOutlinedInput-root": {
                color: "#1e293b",
                fontSize: "13px",
                bgcolor: "#fff",
                borderRadius: "6px",
                transition: "background-color 150ms ease",
                "& fieldset": { borderColor: "#cbd5e1" },
                "&:hover fieldset": { borderColor: "#94a3b8" },
                "&.Mui-focused": { bgcolor: "#ffffff" },
                "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
                "& input": { color: "#1e293b" },
              },
            }}
          />

          <TextField
            fullWidth
            size="small"
            multiline
            minRows={3.5}
            label="Internal Notes"
            value={form.notes}
            onChange={handleChange("notes")}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            sx={{
              "& .MuiInputLabel-root": {
                color: "#64748b",
                fontSize: "13px",
                fontWeight: 500,
                bgcolor: "#ffffff",
                px: 0.6,
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
              "& .MuiOutlinedInput-root": {
                color: "#1e293b",
                fontSize: "13px",
                bgcolor: "#fff",
                borderRadius: "6px",
                transition: "background-color 150ms ease",
                "& fieldset": { borderColor: "#cbd5e1" },
                "&:hover fieldset": { borderColor: "#94a3b8" },
                "&.Mui-focused": { bgcolor: "#ffffff" },
                "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
                "& textarea": { color: "#1e293b" },
              },
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 1.5, pb: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            flex: 1,
            textTransform: "none",
            fontSize: "12px",
            fontWeight: 600,
            bgcolor: "#f1f5f9",
            color: "#1e293b",
            borderRadius: "6px",
            py: 0.9,
            border: "1px solid #e2e8f0",
            "&:hover": {
              bgcolor: "#e2e8f0",
              boxShadow: "none",
            },
            "&.Mui-disabled": {
              bgcolor: "rgba(241, 245, 249, 0.6)",
              color: "rgba(30, 41, 59, 0.4)",
            },
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
            flex: 1,
            textTransform: "none",
            bgcolor: "#F5714E",
            color: "#fff",
            fontSize: "12px",
            fontWeight: 600,
            borderRadius: "6px",
            py: 0.9,
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#e05e3b",
              boxShadow: "none",
            },
            "&.Mui-disabled": {
              bgcolor: "rgba(245, 113, 78, 0.3)",
              color: "rgba(255, 255, 255, 0.7)",
            },
          }}
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
