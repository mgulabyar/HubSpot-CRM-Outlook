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
        bgcolor: "#1e293b", 
        backgroundImage: "none", 
        borderRadius: "8px",
        border: "1px solid #334155",
        mx: 1.5,
        width: "calc(100% - 24px)",
      }
    }
  }}
>
  <DialogTitle
    sx={{
      color: "#f8fafc", 
      fontWeight: 600,
      fontSize: "16px",
      pt: 2,
      px: 1.5, // Reduced from standard 3 to tight 1.5 padding
      pb: 0.5,
    }}
  >
    Edit Contact
  </DialogTitle>

  <DialogContent 
    sx={{ 
      px: 1.5, // Tight padding to let text fields expand fully
      pb: 1.5, 
    }}
  >
    <Stack spacing={2.2} sx={{ pt: 1.5 }}>
      {/* Full Name Input */}
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
            color: "#94a3b8", 
            fontSize: "13px",
            fontWeight: 500,
            bgcolor: "#1e293b", 
            px: 0.6
          },
          "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
          "& .MuiOutlinedInput-root": {
            color: "#f8fafc", 
            fontSize: "13px",
            bgcolor: "#0f172a", 
            borderRadius: "6px",
            "& fieldset": { borderColor: "#334155" },
            "&:hover fieldset": { borderColor: "#475569" },
            "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
            "& input": { color: "#f8fafc" },
          },
        }}
      />

      {/* Email Address Input */}
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
            color: "#94a3b8", 
            fontSize: "13px",
            fontWeight: 500,
            bgcolor: "#1e293b", 
            px: 0.6
          },
          "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
          "& .MuiOutlinedInput-root": {
            color: "#f8fafc",
            fontSize: "13px",
            bgcolor: "#0f172a",
            borderRadius: "6px",
            "& fieldset": { borderColor: "#334155" },
            "&:hover fieldset": { borderColor: "#475569" },
            "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
            "& input": { color: "#f8fafc" },
          },
        }}
      />

      {/* Company Name Input */}
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
            color: "#94a3b8", 
            fontSize: "13px",
            fontWeight: 500,
            bgcolor: "#1e293b", 
            px: 0.6
          },
          "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
          "& .MuiOutlinedInput-root": {
            color: "#f8fafc",
            fontSize: "13px",
            bgcolor: "#0f172a",
            borderRadius: "6px",
            "& fieldset": { borderColor: "#334155" },
            "&:hover fieldset": { borderColor: "#475569" },
            "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
            "& input": { color: "#f8fafc" },
          },
        }}
      />

      {/* Subject Line Input */}
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
            color: "#94a3b8", 
            fontSize: "13px",
            fontWeight: 500,
            bgcolor: "#1e293b", 
            px: 0.6
          },
          "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
          "& .MuiOutlinedInput-root": {
            color: "#f8fafc",
            fontSize: "13px",
            bgcolor: "#0f172a",
            borderRadius: "6px",
            "& fieldset": { borderColor: "#334155" },
            "&:hover fieldset": { borderColor: "#475569" },
            "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
            "& input": { color: "#f8fafc" },
          },
        }}
      />

      {/* Internal Notes Multiline Input */}
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
            color: "#94a3b8", 
            fontSize: "13px",
            fontWeight: 500,
            bgcolor: "#1e293b", 
            px: 0.6
          },
          "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
          "& .MuiOutlinedInput-root": {
            color: "#f8fafc",
            fontSize: "13px",
            bgcolor: "#0f172a",
            borderRadius: "6px",
            "& fieldset": { borderColor: "#334155" },
            "&:hover fieldset": { borderColor: "#475569" },
            "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
            "& textarea": { color: "#f8fafc" },
          },
        }}
      />
    </Stack>
  </DialogContent>

  {/* Highly Professional Balanced Horizontal Action Buttons */}
  <DialogActions sx={{ px: 1.5, pb: 2, gap: 1 }}>
    <Button
      onClick={onClose}
      disabled={loading}
      sx={{
        flex: 1, 
        textTransform: "none",
        fontSize: "13px",
        fontWeight: 500,
        color: "#94a3b8",
        borderRadius: "6px",
        py: 0.8,
        "&:hover": {
          bgcolor: "rgba(148, 163, 184, 0.08)",
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
        bgcolor: "#F5714E", // Your exact standard orange color
        color: "#fff",
        fontSize: "13px",
        fontWeight: 600,
        borderRadius: "6px",
        py: 0.8,
        boxShadow: "none",
        "&:hover": {
          bgcolor: "#e05e3b",
          boxShadow: "none",
        },
        "&.Mui-disabled": {
          bgcolor: "rgba(245, 113, 78, 0.3)",
          color: "rgba(248, 250, 252, 0.4)",
        },
      }}
    >
      {loading ? "Updating..." : "Update"}
    </Button>
  </DialogActions>
</Dialog>

  );
}
