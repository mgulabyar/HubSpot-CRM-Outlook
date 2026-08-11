import React, { useState } from "react";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import type { ContactFormValues } from "../../types/hubspot";

type ContactFormProps = {
  loading: boolean;
  onSubmit: (values: ContactFormValues) => Promise<boolean>;
  onFindContact: (email: string) => Promise<void>;
};

const initialForm: ContactFormValues = {
  name: "",
  email: "",
  company: "",
  subject: "",
  notes: "",
};

export default function ContactForm({ loading, onSubmit, onFindContact }: ContactFormProps) {
  const [form, setForm] = useState<ContactFormValues>(initialForm);

  const [validationError, setValidationError] = useState("");

  const handleChange =
    (field: keyof ContactFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((previous) => ({
        ...previous,
        [field]: event.target.value,
      }));

      setValidationError("");
    };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setValidationError("Full name is required.");
      return;
    }

    if (!form.email.trim()) {
      setValidationError("Email address is required.");
      return;
    }

    const successful = await onSubmit(form);

    if (successful) {
      setForm(initialForm);
      setValidationError("");
    }
  };

  const handleFindContact = async () => {
    if (!form.email.trim()) {
      setValidationError("Enter an email address to find a contact.");
      return;
    }

    await onFindContact(form.email.trim());
  };

  return (
 
    <Stack
      spacing={2.2}
      sx={{
        p: 1,
      }}
    >
      {validationError && (
        <Alert
          severity="warning"
          variant="outlined"
          onClose={() => setValidationError("")}
          sx={{
            borderRadius: "6px",
            fontSize: "12px",
            color: "#92400e",
            borderColor: "rgba(217, 119, 6, 0.35)",
            bgcolor: "rgba(251, 191, 36, 0.1)",
            "& .MuiAlert-icon": {
              color: "#d97706",
            },
          }}
        >
          {validationError}
        </Alert>
      )}

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

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          width: "100%",
          pt: 0.5,
        }}
      >
        <Button
          variant="contained"
          disabled={loading}
          onClick={() => {
            void handleSubmit();
          }}
          sx={{
            flex: 1,
            textTransform: "none",
            borderRadius: "6px",
            bgcolor: "#F5714E",
            color: "#fff",
            fontSize: "12px",
            fontWeight: 600,
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
          {loading ? "Saving..." : "Save Contact"}
        </Button>

        <Button
          variant="contained"
          disabled={loading}
          onClick={() => {
            void handleFindContact();
          }}
          sx={{
            flex: 1,
            textTransform: "none",
            borderRadius: "6px",
            bgcolor: "#f1f5f9",
            color: "#1e293b",
            fontSize: "12px",
            fontWeight: 600,
            py: 0.9,
            boxShadow: "none",
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
          Search
        </Button>
      </Box>
    </Stack>
  );
}
