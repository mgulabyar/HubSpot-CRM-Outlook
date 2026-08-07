import React, { useState } from "react";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
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

const HUBSPOT_BRAND = {
  primary: "#ff7a59",
  primaryHover: "#ea6541",
  charcoal: "#2d3e50",
  charcoalHover: "#1e2a36",
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
  spacing={2.5} 
  sx={{ 
    p: 2, 
    bgcolor: "#1e293b", // Premium Deep Slate Dark Background for the whole form container
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  }}
>
  {/* Modernized Dark Mode Alert */}
  {validationError && (
    <Alert
      severity="warning"
      variant="outlined"
      onClose={() => setValidationError("")}
      sx={{
        borderRadius: "6px",
        fontSize: "12px",
        color: "#fef08a", // Soft premium yellow text
        borderColor: "rgba(234, 179, 8, 0.3)",
        bgcolor: "rgba(234, 179, 8, 0.06)",
        "& .MuiAlert-icon": {
          color: "#eab308",
        },
      }}
    >
      {validationError}
    </Alert>
  )}

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
        bgcolor: "#1e293b", // Matches form background to perfectly fix overlapping/cut line lines
        px: 0.6
      },
      "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
      "& .MuiOutlinedInput-root": {
        color: "#f8fafc", // Crisp white input text values
        fontSize: "13px",
        bgcolor: "#0f172a", // Deep dark inner background pod
        borderRadius: "6px",
        "& fieldset": { borderColor: "#334155" }, // Clean subtle dark border
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

  {/* Highly Professional Balanced Horizontal Buttons */}
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
    {/* Save Contact Button */}
    <Button
      variant="contained"
      disabled={loading}
      // startIcon={<SaveIcon sx={{ fontSize: "15px !important" }} />}
      onClick={() => {
        void handleSubmit();
      }}
      sx={{
        flex: 1,
        textTransform: "none",
        borderRadius: "6px",
        bgcolor: "#F5714E", // Unified branding color
        color: "#fff",
        fontSize: "13px",
        fontWeight: 600,
        py: 0.9,
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
      {loading ? "Saving..." : "Create"}
    </Button>

    <Button
      variant="contained"
      disabled={loading}
      // startIcon={<SearchIcon sx={{ fontSize: "15px !important" }} />}
      onClick={() => {
        void handleFindContact();
      }}
      sx={{
        flex: 1,
        textTransform: "none",
        borderRadius: "6px",
        bgcolor: "#334155", // Perfectly matches dark mode accents
        color: "#f8fafc",
        fontSize: "13px",
        fontWeight: 600,
        py: 0.9,
        boxShadow: "none",
        "&:hover": {
          bgcolor: "#475569",
          boxShadow: "none",
        },
        "&.Mui-disabled": {
          bgcolor: "rgba(51, 65, 85, 0.3)",
          color: "rgba(248, 250, 252, 0.4)",
        },
      }}
    >
      Find Contact
    </Button>
  </Box>
</Stack>

  );
}
