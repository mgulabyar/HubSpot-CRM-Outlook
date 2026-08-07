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
    <Stack spacing={2}>
      {validationError && (
        <Alert
          severity="warning"
          onClose={() => setValidationError("")}
          sx={{
            borderRadius: "4px",
            fontSize: "12px",
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
          inputLabel: {
            shrink: true,
          },
        }}
        sx={{ bgcolor: "#fff" }}
      />

      <TextField
        fullWidth
        size="small"
        type="email"
        label="Email Address"
        value={form.email}
        onChange={handleChange("email")}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
        sx={{ bgcolor: "#fff" }}
      />

      <TextField
        fullWidth
        size="small"
        label="Company Name"
        value={form.company}
        onChange={handleChange("company")}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
        sx={{ bgcolor: "#fff" }}
      />

      <TextField
        fullWidth
        size="small"
        label="Subject Line"
        value={form.subject}
        onChange={handleChange("subject")}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
        sx={{ bgcolor: "#fff" }}
      />

      <TextField
        fullWidth
        size="small"
        multiline
        minRows={3}
        label="Internal Notes"
        value={form.notes}
        onChange={handleChange("notes")}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
        sx={{ bgcolor: "#fff" }}
      />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.2,
        }}
      >
        <Button
          variant="contained"
          disabled={loading}
          startIcon={<SaveIcon sx={{ fontSize: "16px !important" }} />}
          onClick={() => {
            void handleSubmit();
          }}
          sx={{
            textTransform: "none",
            borderRadius: "4px",
            bgcolor: HUBSPOT_BRAND.primary,
            fontSize: "13px",
            fontWeight: 600,
            px: 2,
            py: 0.6,
            boxShadow: "none",
            "&:hover": {
              bgcolor: HUBSPOT_BRAND.primaryHover,
              boxShadow: "none",
            },
          }}
        >
          {loading ? "Saving..." : "Save Contact"}
        </Button>

        <Button
          variant="contained"
          disabled={loading}
          startIcon={<SearchIcon sx={{ fontSize: "16px !important" }} />}
          onClick={() => {
            void handleFindContact();
          }}
          sx={{
            textTransform: "none",
            borderRadius: "4px",
            bgcolor: HUBSPOT_BRAND.charcoal,
            fontSize: "13px",
            fontWeight: 600,
            px: 2,
            py: 0.6,
            boxShadow: "none",
            "&:hover": {
              bgcolor: HUBSPOT_BRAND.charcoalHover,
              boxShadow: "none",
            },
          }}
        >
          Find Contact
        </Button>
      </Box>
    </Stack>
  );
}
