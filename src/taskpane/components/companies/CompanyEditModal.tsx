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

import type { CompanyFormValues, CompanyRecord } from "../../types/CompanyModels";

type Props = {
  open: boolean;
  company: CompanyRecord | null;
  loading: boolean;
  onClose: () => void;
  onSave: (values: CompanyFormValues) => Promise<boolean>;
};

const emptyForm: CompanyFormValues = {
  name: "",
  domain: "",
  phone: "",
  city: "",
  state: "",
  country: "",
  industry: "",
  numberofemployees: "",
};

export default function CompanyEditModal({ open, company, loading, onClose, onSave }: Props) {
  const [form, setForm] = useState<CompanyFormValues>(emptyForm);

  useEffect(() => {
    if (!company) {
      setForm(emptyForm);
      return;
    }

    setForm({
      name: company.properties.name || "",
      domain: company.properties.domain || "",
      phone: company.properties.phone || "",
      city: company.properties.city || "",
      state: company.properties.state || "",
      country: company.properties.country || "",
      industry: company.properties.industry || "",
      numberofemployees: company.properties.numberofemployees || "",
    });
  }, [company]);

  const updateField =
    (field: keyof CompanyFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((previous) => ({
        ...previous,
        [field]: event.target.value,
      }));
    };

  const saveChanges = async () => {
    const successful = await onSave(form);

    if (successful) {
      setForm(emptyForm);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          color: "#1e2a3c",
          fontWeight: 700,
          fontSize: "18px",
        }}
      >
        Edit Company
      </DialogTitle>

      <DialogContent>
        <Stack spacing={1.5} sx={{ pt: 1 }}>
          <TextField
            size="small"
            fullWidth
            label="Company Name"
            value={form.name}
            onChange={updateField("name")}
          />

          <TextField
            size="small"
            fullWidth
            label="Domain"
            value={form.domain}
            onChange={updateField("domain")}
          />

          <TextField
            size="small"
            fullWidth
            label="Phone"
            value={form.phone}
            onChange={updateField("phone")}
          />

          <TextField
            size="small"
            fullWidth
            label="Industry"
            value={form.industry}
            onChange={updateField("industry")}
          />

          <TextField
            size="small"
            fullWidth
            type="number"
            label="Number of Employees"
            value={form.numberofemployees}
            onChange={updateField("numberofemployees")}
          />

          <TextField
            size="small"
            fullWidth
            label="City"
            value={form.city}
            onChange={updateField("city")}
          />

          <TextField
            size="small"
            fullWidth
            label="State"
            value={form.state}
            onChange={updateField("state")}
          />

          <TextField
            size="small"
            fullWidth
            label="Country"
            value={form.country}
            onChange={updateField("country")}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          type="button"
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
          type="button"
          variant="contained"
          onClick={() => {
            void saveChanges();
          }}
          disabled={loading}
          sx={{
            textTransform: "none",
            bgcolor: "#F5714E",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#e65f3d",
              boxShadow: "none",
            },
          }}
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
