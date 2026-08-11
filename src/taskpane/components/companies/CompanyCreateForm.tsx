import React, { useState } from "react";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

import type { CompanyFormValues } from "../../types/CompanyModels";

type Props = {
  loading: boolean;
  onSubmit: (values: CompanyFormValues) => Promise<boolean>;
};

const defaultValues: CompanyFormValues = {
  name: "",
  domain: "",
  phone: "",
  city: "",
  state: "",
  country: "",
  industry: "",
  numberofemployees: "",
};

export default function CompanyCreateForm({ loading, onSubmit }: Props) {
  const [form, setForm] = useState<CompanyFormValues>(defaultValues);

  const [error, setError] = useState("");

  const updateField =
    (field: keyof CompanyFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((previous) => ({
        ...previous,
        [field]: event.target.value,
      }));

      setError("");
    };

  const submitForm = async () => {
    if (!form.name.trim()) {
      setError("Company name is required.");
      return;
    }

    const successful = await onSubmit({
      name: form.name.trim(),
      domain: form.domain.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      country: form.country.trim(),
      industry: form.industry.trim(),
      numberofemployees: form.numberofemployees.trim(),
    });

    if (successful) {
      setForm(defaultValues);
    }
  };

  return (
    <Stack spacing={2.2}>
      {error && (
        <Alert
          severity="warning"
          variant="outlined"
          onClose={() => setError("")}
          sx={{
            borderRadius: "6px",
            fontSize: "12px",
            color: "#fef08a",
            borderColor: "rgba(234, 179, 8, 0.3)",
            bgcolor: "rgba(234, 179, 8, 0.06)",
            "& .MuiAlert-icon": {
              color: "#eab308",
            },
          }}
        >
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        size="small"
        label="Company Name"
        value={form.name}
        onChange={updateField("name")}
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
        label="Domain"
        placeholder="example.com"
        value={form.domain}
        onChange={updateField("domain")}
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
        label="Phone"
        value={form.phone}
        onChange={updateField("phone")}
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
        label="Industry"
        value={form.industry}
        onChange={updateField("industry")}
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
        type="number"
        label="Number of Employees"
        value={form.numberofemployees}
        onChange={updateField("numberofemployees")}
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

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1.5,
        }}
      >
        <TextField
          size="small"
          label="City"
          value={form.city}
          onChange={updateField("city")}
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
          size="small"
          label="State"
          value={form.state}
          onChange={updateField("state")}
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
      </Box>

      <TextField
        fullWidth
        size="small"
        label="Country"
        value={form.country}
        onChange={updateField("country")}
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

      <Button
        type="button"
        variant="contained"
        disabled={loading}
        startIcon={<SaveIcon sx={{ fontSize: "15px !important" }} />}
        onClick={() => {
          void submitForm();
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
        {loading ? "Saving..." : "Save Company"}
      </Button>
    </Stack>
  );
}
