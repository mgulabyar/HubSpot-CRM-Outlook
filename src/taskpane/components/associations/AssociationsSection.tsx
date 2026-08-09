import React, {
  useCallback,
  useState,
} from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import AssociationCreateForm from "./AssociationCreateForm";
import AssociationCards from "./AssociationCards";

import {
  createAssociation,
  deleteAssociation,
  fetchAssociations,
} from "../../services/AssociationApi";

import type {
  AssociationFormValues,
  AssociationResult,
} from "../../types/AssociationModels";

import { getApiErrorMessage } from "../../utils/apiError";

type ToastSeverity =
  | "success"
  | "error"
  | "info"
  | "warning";

export default function AssociationsSection() {
  const [associations, setAssociations] =
    useState<AssociationResult[]>([]);

  const [currentSearch, setCurrentSearch] =
    useState<AssociationFormValues | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [pendingDelete, setPendingDelete] =
    useState<AssociationFormValues | null>(null);

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: ToastSeverity;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = useCallback(
    (
      message: string,
      severity: ToastSeverity
    ) => {
      setToast({
        open: true,
        message,
        severity,
      });
    },
    []
  );

  const closeToast = () => {
    setToast((previous) => ({
      ...previous,
      open: false,
    }));
  };

  const loadAssociations = async (
    values: AssociationFormValues
  ) => {
    try {
      setLoading(true);

      const response =
        await fetchAssociations(
          values.fromType,
          values.fromId,
          values.toType
        );

      setCurrentSearch(values);
      setAssociations(response.results || []);
    } catch (error) {
      console.error(
        "[AssociationsSection] load failed:",
        error
      );

      showToast(
        getApiErrorMessage(error),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (
    values: AssociationFormValues
  ): Promise<boolean> => {
    try {
      setSaving(true);

      await createAssociation(values);

      await loadAssociations(values);

      showToast(
        "Association created successfully.",
        "success"
      );

      return true;
    } catch (error) {
      console.error(
        "[AssociationsSection] create failed:",
        error
      );

      showToast(
        getApiErrorMessage(error),
        "error"
      );

      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleRequestDelete = async (
    values: AssociationFormValues
  ): Promise<void> => {
    setPendingDelete(values);
  };

  const handleCancelDelete = () => {
    if (deletingId) {
      return;
    }

    setPendingDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) {
      return;
    }

    const targetId = pendingDelete.toId;

    try {
      setDeletingId(targetId);

      await deleteAssociation(pendingDelete);

      if (currentSearch) {
        await loadAssociations(currentSearch);
      }

      showToast(
        "Association deleted successfully.",
        "success"
      );
    } catch (error) {
      console.error(
        "[AssociationsSection] delete failed:",
        error
      );

      showToast(
        getApiErrorMessage(error),
        "error"
      );
    } finally {
      setDeletingId(null);
      setPendingDelete(null);
    }
  };

  const pendingTargetId =
    pendingDelete?.toId || "";

  return (
    <>
      <Stack spacing={2}>
        <Box>
          <Typography
            sx={{
              color: "#f8fafc",
              fontWeight: 700,
              fontSize: "16px",
            }}
          >
            Associations
          </Typography>

          <Typography
            sx={{
              color: "#94a3b8",
              fontSize: "11px",
              mt: 0.4,
            }}
          >
            Link contacts, companies, deals and tasks.
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Chip
            label="CRM Connected"
            size="small"
            sx={{
              color: "#F5714E",
              bgcolor:
                "rgba(245, 113, 78, 0.08)",
              fontSize: "11px",
              fontWeight: 600,
            }}
          />

          <Chip
            label={`${associations.length} Links`}
            size="small"
            sx={{
              color: "#cbd5e1",
              bgcolor:
                "rgba(203, 213, 225, 0.08)",
              fontSize: "11px",
              fontWeight: 600,
            }}
          />
        </Stack>

        <Divider
          sx={{
            borderColor: "#334155",
          }}
        />

        <AssociationCreateForm
          loading={saving}
          onSubmit={handleCreate}
        />

        <Divider
          sx={{
            borderColor: "#334155",
          }}
        />

        <Box>
          <Typography
            sx={{
              color: "#f8fafc",
              fontWeight: 700,
              fontSize: "14px",
              mb: 1.2,
            }}
          >
            Existing Associations
          </Typography>

          {currentSearch ? (
            <AssociationCards
              associations={associations}
              source={currentSearch}
              loading={loading}
              deletingId={deletingId}
              onDelete={handleRequestDelete}
            />
          ) : (
            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: "12px",
              }}
            >
              Create an association to view linked records.
            </Typography>
          )}
        </Box>
      </Stack>

      <Dialog
        open={Boolean(pendingDelete)}
        onClose={
          deletingId
            ? undefined
            : handleCancelDelete
        }
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontSize: "16px",
            fontWeight: 700,
          }}
        >
          Delete association
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            sx={{
              fontSize: "13px",
            }}
          >
            Are you sure you want to remove association
            with record{" "}
            <strong>{pendingTargetId}</strong>?
          </DialogContentText>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
          }}
        >
          <Button
            type="button"
            disabled={Boolean(deletingId)}
            onClick={handleCancelDelete}
            sx={{
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="contained"
            color="error"
            disabled={Boolean(deletingId)}
            onClick={() => {
              void handleConfirmDelete();
            }}
            sx={{
              textTransform: "none",
            }}
          >
            {deletingId ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={closeToast}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={closeToast}
          sx={{
            width: "100%",
            fontSize: "12px",
            borderRadius: "4px",
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}