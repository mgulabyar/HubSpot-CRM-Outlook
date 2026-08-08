import React, { useCallback, useEffect, useState } from "react";

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

import CompanyCreateForm from "./CompanyCreateForm";
import CompanyEditModal from "./CompanyEditModal";
import CompanyCards from "./CompanyCards";

import {
  createNewCompany,
  fetchCompanies,
  removeCompany,
  updateExistingCompany,
} from "../../services/CompanyApi";

import type { CompanyFormValues, CompanyRecord } from "../../types/CompanyModels";

import { getApiErrorMessage } from "../../utils/apiError";

type ToastSeverity = "success" | "error" | "info" | "warning";

export default function CompaniesSection() {
  const [companies, setCompanies] = useState<CompanyRecord[]>([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editingCompany, setEditingCompany] = useState<CompanyRecord | null>(null);

  const [editOpen, setEditOpen] = useState(false);

  const [pendingDelete, setPendingDelete] = useState<CompanyRecord | null>(null);

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: ToastSeverity;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = useCallback((message: string, severity: ToastSeverity) => {
    setToast({
      open: true,
      message,
      severity,
    });
  }, []);

  const closeToast = () => {
    setToast((previous) => ({
      ...previous,
      open: false,
    }));
  };

  const loadCompanies = useCallback(async () => {
    try {
      setLoading(true);

      console.log("[CompaniesSection] loading companies...");

      const response = await fetchCompanies(20);

      const loadedCompanies = response.results || [];

      console.log("[CompaniesSection] loaded companies:", loadedCompanies);

      setCompanies(loadedCompanies);
    } catch (error) {
      console.error("[CompaniesSection] load failed:", error);

      showToast(getApiErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void loadCompanies();
  }, [loadCompanies]);

  const handleCreate = async (values: CompanyFormValues): Promise<boolean> => {
    try {
      setSaving(true);

      console.log("[CompaniesSection] create started:", values);

      await createNewCompany(values);
      await loadCompanies();

      showToast("Company created successfully.", "success");

      return true;
    } catch (error) {
      console.error("[CompaniesSection] create failed:", error);

      showToast(getApiErrorMessage(error), "error");

      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleOpenEdit = (companyId: string) => {
    const selectedCompany = companies.find((company) => String(company.id) === String(companyId));

    if (!selectedCompany) {
      showToast("Company not found.", "error");

      return;
    }

    setEditingCompany(selectedCompany);
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    if (saving) {
      return;
    }

    setEditOpen(false);
    setEditingCompany(null);
  };

  const handleUpdate = async (values: CompanyFormValues): Promise<boolean> => {
    if (!editingCompany) {
      showToast("No company selected.", "error");

      return false;
    }

    try {
      setSaving(true);

      console.log("[CompaniesSection] update started:", editingCompany.id, values);

      await updateExistingCompany(String(editingCompany.id), values);

      await loadCompanies();

      setEditOpen(false);
      setEditingCompany(null);

      showToast("Company updated successfully.", "success");

      return true;
    } catch (error) {
      console.error("[CompaniesSection] update failed:", error);

      showToast(getApiErrorMessage(error), "error");

      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleRequestDelete = async (companyId: string): Promise<void> => {
    console.log("[CompaniesSection] delete requested:", companyId);

    const selectedCompany = companies.find((company) => String(company.id) === String(companyId));

    if (!selectedCompany) {
      showToast("Company not found.", "error");

      return;
    }

    setPendingDelete(selectedCompany);
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

    const cleanId = String(pendingDelete.id).trim();

    try {
      setDeletingId(cleanId);

      console.log("[CompaniesSection] delete started:", cleanId);

      const result = await removeCompany(cleanId);

      console.log("[CompaniesSection] delete result:", result);

      setCompanies((previousCompanies) =>
        previousCompanies.filter((company) => String(company.id) !== cleanId)
      );

      showToast("Company deleted successfully.", "success");
    } catch (error) {
      console.error("[CompaniesSection] delete failed:", error);

      showToast(getApiErrorMessage(error), "error");
    } finally {
      setDeletingId(null);
      setPendingDelete(null);
    }
  };

  const companyName = pendingDelete?.properties?.name || "this company";

  return (
    <>
      <Stack spacing={1.5} sx={{ bgcolor: "#0f172a", p: 1, minHeight: "100vh" }}>
        <CompanyCreateForm loading={saving} onSubmit={handleCreate} />

        <Divider sx={{ borderColor: "#1e293b" }} />

        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.5,
            }}
          >
            <Typography
              sx={{
                color: "#f8fafc",
                fontWeight: 600,
                fontSize: "13.5px",
                letterSpacing: "0.2px",
              }}
            >
              Recent Companies
            </Typography>

            <Chip
              label={`${companies.length} Companies`}
              size="small"
              variant="outlined"
              sx={{
                color: "#cbd5e1",
                borderColor: "#334155",
                bgcolor: "#1e293b",
                fontSize: "10.5px",
                fontWeight: 600,
                height: 24,
                borderRadius: "4px",
                px: 0.5,
              }}
            />
          </Box>

          <CompanyCards
            companies={companies}
            loading={loading}
            deletingId={deletingId}
            onEdit={handleOpenEdit}
            onDelete={handleRequestDelete}
          />
        </Box>
      </Stack>

      <CompanyEditModal
        open={editOpen}
        company={editingCompany}
        loading={saving}
        onClose={handleCloseEdit}
        onSave={handleUpdate}
      />

      <Dialog
        open={Boolean(pendingDelete)}
        onClose={deletingId ? undefined : handleCancelDelete}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: "#1e293b",
              backgroundImage: "none", 
              borderRadius: "8px",
              border: "1px solid #334155",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "15px",
            fontWeight: 600,
            color: "#f8fafc", 
            pb: 1,
          }}
        >
          Delete company
        </DialogTitle>

        <DialogContent sx={{ pb: 2 }}>
          <DialogContentText
            sx={{
              fontSize: "12.5px",
              color: "#cbd5e1",
              lineHeight: 1.45,
            }}
          >
            Are you sure you want to delete{" "}
            <strong style={{ color: "#f8fafc" }}>{companyName}</strong>? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 0.5 }}>
          <Button
            type="button"
            disabled={Boolean(deletingId)}
            onClick={handleCancelDelete}
            sx={{
              textTransform: "none",
              fontSize: "12.5px",
              color: "#94a3b8",
              fontWeight: 500,
              "&:hover": { bgcolor: "rgba(148, 163, 184, 0.08)" },
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
              fontSize: "12.5px",
              fontWeight: 600,
              borderRadius: "6px",
              boxShadow: "none",
              bgcolor: "#dc2626", 
              "&:hover": { bgcolor: "#b91c1c", boxShadow: "none" },
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
