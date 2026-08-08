import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

import type {
  CompanyFormValues,
} from "../../types/CompanyModels";

type Props = {
  loading: boolean;
  onSubmit: (
    values: CompanyFormValues
  ) => Promise<boolean>;
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

export default function CompanyCreateForm({
  loading,
  onSubmit,
}: Props) {
  const [form, setForm] =
    useState<CompanyFormValues>(defaultValues);

  const [error, setError] = useState("");

  const updateField =
    (field: keyof CompanyFormValues) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >
    ) => {
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
      numberofemployees:
        form.numberofemployees.trim(),
    });

    if (successful) {
      setForm(defaultValues);
    }
  };

  return (
    <Stack spacing={1.3}>
      {error && (
        <Alert
          severity="warning"
          onClose={() => setError("")}
          sx={{
            borderRadius: "4px",
            fontSize: "12px",
          }}
        >
          {error}
        </Alert>
      )}

      <TextField
        size="small"
        fullWidth
        label="Company Name"
        value={form.name}
        onChange={updateField("name")}
        sx={{ bgcolor: "#fff" }}
      />

      <TextField
        size="small"
        fullWidth
        label="Domain"
        placeholder="example.com"
        value={form.domain}
        onChange={updateField("domain")}
        sx={{ bgcolor: "#fff" }}
      />

      <TextField
        size="small"
        fullWidth
        label="Phone"
        value={form.phone}
        onChange={updateField("phone")}
        sx={{ bgcolor: "#fff" }}
      />

      <TextField
        size="small"
        fullWidth
        label="Industry"
        value={form.industry}
        onChange={updateField("industry")}
        sx={{ bgcolor: "#fff" }}
      />

      <TextField
        size="small"
        fullWidth
        type="number"
        label="Number of Employees"
        value={form.numberofemployees}
        onChange={updateField(
          "numberofemployees"
        )}
        sx={{ bgcolor: "#fff" }}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1,
        }}
      >
        <TextField
          size="small"
          label="City"
          value={form.city}
          onChange={updateField("city")}
          sx={{ bgcolor: "#fff" }}
        />

        <TextField
          size="small"
          label="State"
          value={form.state}
          onChange={updateField("state")}
          sx={{ bgcolor: "#fff" }}
        />
      </Box>

      <TextField
        size="small"
        fullWidth
        label="Country"
        value={form.country}
        onChange={updateField("country")}
        sx={{ bgcolor: "#fff" }}
      />

      <Button
        type="button"
        variant="contained"
        disabled={loading}
        startIcon={
          <SaveIcon
            sx={{
              fontSize: "16px !important",
            }}
          />
        }
        onClick={() => {
          void submitForm();
        }}
        sx={{
          alignSelf: "flex-start",
          textTransform: "none",
          borderRadius: "4px",
          bgcolor: "#F5714E",
          fontSize: "13px",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            bgcolor: "#e65f3d",
            boxShadow: "none",
          },
        }}
      >
        {loading ? "Saving..." : "Save"}
      </Button>
    </Stack>
  );
}