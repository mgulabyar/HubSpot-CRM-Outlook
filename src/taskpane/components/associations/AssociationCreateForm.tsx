import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";

import type {
  AssociationFormValues,
  AssociationObjectType,
} from "../../types/AssociationModels";

type Props = {
  loading: boolean;
  onSubmit: (
    values: AssociationFormValues
  ) => Promise<boolean>;
};

const initialValues: AssociationFormValues = {
  fromType: "contacts",
  fromId: "",
  toType: "companies",
  toId: "",
};

function cleanId(value: string) {
  return value.replace(/\s+/g, "").trim();
}

export default function AssociationCreateForm({
  loading,
  onSubmit,
}: Props) {
  const [form, setForm] =
    useState<AssociationFormValues>(initialValues);

  const [error, setError] = useState("");

  const updateField =
    (
      field:
        | "fromType"
        | "fromId"
        | "toType"
        | "toId"
    ) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >
    ) => {
      let value = event.target.value;

      if (
        field === "fromId" ||
        field === "toId"
      ) {
        value = cleanId(value);
      }

      setForm((previous) => ({
        ...previous,
        [field]: value,
      }));

      setError("");
    };

  const handleSubmit = async () => {
    const fromId = cleanId(form.fromId);
    const toId = cleanId(form.toId);

    if (!fromId || !toId) {
      setError(
        "Both source and target record IDs are required."
      );

      return;
    }

    if (
      !/^[0-9]+$/.test(fromId) ||
      !/^[0-9]+$/.test(toId)
    ) {
      setError(
        "Record IDs must contain numbers only."
      );

      return;
    }

    if (
      form.fromType === form.toType &&
      fromId === toId
    ) {
      setError(
        "A record cannot be associated with itself."
      );

      return;
    }

    const successful = await onSubmit({
      ...form,
      fromId,
      toId,
    });

    if (successful) {
      setForm({
        ...initialValues,
        fromType: form.fromType,
        toType: form.toType,
      });

      setError("");
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

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1,
        }}
      >
        <TextField
          select
          size="small"
          label="From Type"
          value={form.fromType}
          onChange={updateField("fromType")}
          sx={{ bgcolor: "#fff" }}
        >
          <MenuItem value="contacts">
            Contact
          </MenuItem>

          <MenuItem value="companies">
            Company
          </MenuItem>

          <MenuItem value="deals">
            Deal
          </MenuItem>

          <MenuItem value="tasks">
            Task
          </MenuItem>
        </TextField>

        <TextField
          size="small"
          label="From ID"
          value={form.fromId}
          onChange={updateField("fromId")}
          sx={{ bgcolor: "#fff" }}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1,
        }}
      >
        <TextField
          select
          size="small"
          label="To Type"
          value={form.toType}
          onChange={updateField("toType")}
          sx={{ bgcolor: "#fff" }}
        >
          <MenuItem value="contacts">
            Contact
          </MenuItem>

          <MenuItem value="companies">
            Company
          </MenuItem>

          <MenuItem value="deals">
            Deal
          </MenuItem>

          <MenuItem value="tasks">
            Task
          </MenuItem>
        </TextField>

        <TextField
          size="small"
          label="To ID"
          value={form.toId}
          onChange={updateField("toId")}
          sx={{ bgcolor: "#fff" }}
        />
      </Box>

      <Button
        type="button"
        variant="contained"
        disabled={loading}
        startIcon={
          <LinkIcon
            sx={{
              fontSize: "16px !important",
            }}
          />
        }
        onClick={() => {
          void handleSubmit();
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
        {loading
          ? "Associating..."
          : "Create Association"}
      </Button>
    </Stack>
  );
}