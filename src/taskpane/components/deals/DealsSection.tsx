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

import DealCreateForm from "./DealCreateForm";
import DealEditModal from "./DealEditModal";
import DealCards from "./DealCards";

import {
  createNewDeal,
  fetchDealPipelines,
  fetchDealStages,
  fetchDeals,
  removeDeal,
  updateExistingDeal,
} from "../../services/DealApi";

import type { DealFormValues, DealPipeline, DealRecord, DealStage } from "../../types/DealModels";

import { getApiErrorMessage } from "../../utils/apiError";

type ToastSeverity = "success" | "error" | "info" | "warning";

export default function DealsSection() {
  const [deals, setDeals] = useState<DealRecord[]>([]);

  const [pipelines, setPipelines] = useState<DealPipeline[]>([]);

  const [stages, setStages] = useState<DealStage[]>([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editingDeal, setEditingDeal] = useState<DealRecord | null>(null);

  const [editOpen, setEditOpen] = useState(false);

  const [pendingDelete, setPendingDelete] = useState<DealRecord | null>(null);

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

  const loadStages = useCallback(
    async (pipelineId: string) => {
      if (!pipelineId) {
        setStages([]);
        return;
      }

      try {
        const response = await fetchDealStages(pipelineId);

        setStages(response.results || []);
      } catch (error) {
        console.error("[DealsSection] stages failed:", error);

        setStages([]);

        showToast(getApiErrorMessage(error), "error");
      }
    },
    [showToast]
  );

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);

      const [dealsResponse, pipelinesResponse] = await Promise.all([
        fetchDeals(20),
        fetchDealPipelines(),
      ]);

      const loadedPipelines = pipelinesResponse.results || [];

      setDeals(dealsResponse.results || []);
      setPipelines(loadedPipelines);

      if (loadedPipelines[0]?.id) {
        await loadStages(loadedPipelines[0].id);
      }
    } catch (error) {
      console.error("[DealsSection] initial load failed:", error);

      showToast(getApiErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  }, [loadStages, showToast]);

  useEffect(() => {
    void loadInitialData();
  }, [loadInitialData]);

  const handlePipelineChange = async (pipelineId: string) => {
    await loadStages(pipelineId);
  };

  const handleCreate = async (values: DealFormValues): Promise<boolean> => {
    try {
      setSaving(true);

      await createNewDeal(values);

      const response = await fetchDeals(20);

      setDeals(response.results || []);

      showToast("Deal created successfully.", "success");

      return true;
    } catch (error) {
      console.error("[DealsSection] create failed:", error);

      showToast(getApiErrorMessage(error), "error");

      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleOpenEdit = (dealId: string) => {
    const selectedDeal = deals.find((deal) => String(deal.id) === String(dealId));

    if (!selectedDeal) {
      showToast("Deal not found.", "error");

      return;
    }

    setEditingDeal(selectedDeal);
    setEditOpen(true);

    if (selectedDeal.properties.pipeline) {
      void loadStages(selectedDeal.properties.pipeline);
    }
  };

  const handleCloseEdit = () => {
    if (saving) {
      return;
    }

    setEditOpen(false);
    setEditingDeal(null);
  };

  const handleUpdate = async (values: DealFormValues): Promise<boolean> => {
    if (!editingDeal) {
      showToast("No deal selected.", "error");

      return false;
    }

    try {
      setSaving(true);

      await updateExistingDeal(String(editingDeal.id), values);

      const response = await fetchDeals(20);

      setDeals(response.results || []);

      setEditOpen(false);
      setEditingDeal(null);

      showToast("Deal updated successfully.", "success");

      return true;
    } catch (error) {
      console.error("[DealsSection] update failed:", error);

      showToast(getApiErrorMessage(error), "error");

      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleRequestDelete = async (dealId: string): Promise<void> => {
    const selectedDeal = deals.find((deal) => String(deal.id) === String(dealId));

    if (!selectedDeal) {
      showToast("Deal not found.", "error");

      return;
    }

    setPendingDelete(selectedDeal);
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

      await removeDeal(cleanId);

      setDeals((previousDeals) => previousDeals.filter((deal) => String(deal.id) !== cleanId));

      showToast("Deal deleted successfully.", "success");
    } catch (error) {
      console.error("[DealsSection] delete failed:", error);

      showToast(getApiErrorMessage(error), "error");
    } finally {
      setDeletingId(null);
      setPendingDelete(null);
    }
  };

  const pendingDealName = pendingDelete?.properties?.dealname || "this deal";

  return (
    <>
      <Stack spacing={1.5} sx={{ bgcolor: "#0f172a", p: 1, minHeight: "100vh" }}>
        <DealCreateForm
          loading={saving}
          pipelines={pipelines}
          stages={stages}
          onPipelineChange={handlePipelineChange}
          onSubmit={handleCreate}
        />

        <Divider sx={{ borderColor: "#1e293b" }} />

        {/* Recent Deals Section with Embedded Right-Aligned Count Chip */}
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between", // Pushes heading to left and chip to right
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
              Recent Deals
            </Typography>

            {/* Count Chip shifted exactly next to the section heading */}
            <Chip
              label={`${deals.length} Deals`}
              size="small"
              variant="outlined"
              sx={{
                color: "#cbd5e1",
                borderColor: "#334155",
                bgcolor: "#1e293b", // Matches workspace dark system accents
                fontSize: "10.5px",
                fontWeight: 600,
                height: 20, // Modern low-profile premium sizing
                borderRadius: "4px", // Matches clean edge geometry of our cards framework
                px: 0.5,
              }}
            />
          </Box>

          <DealCards
            deals={deals}
            loading={loading}
            deletingId={deletingId}
            onEdit={handleOpenEdit}
            onDelete={handleRequestDelete}
          />
        </Box>
      </Stack>

      <DealEditModal
        open={editOpen}
        deal={editingDeal}
        pipelines={pipelines}
        stages={stages}
        loading={saving}
        onPipelineChange={handlePipelineChange}
        onClose={handleCloseEdit}
        onSave={handleUpdate}
      />

      <Dialog
        open={Boolean(pendingDelete)}
        onClose={deletingId ? undefined : handleCancelDelete}
        maxWidth="xs"
        fullWidth
        // Safe strongly-typed slot override for deep dark dialog surface grid
        slotProps={{
          paper: {
            sx: {
              bgcolor: "#1e293b", // Matte slate surface container background
              backgroundImage: "none", // Critical layout parameter to prevent MUI opacity tint bugs
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
            color: "#f8fafc", // Bright crisp white header text
            pb: 1,
          }}
        >
          Delete deal
        </DialogTitle>

        <DialogContent sx={{ pb: 2 }}>
          <DialogContentText
            sx={{
              fontSize: "12.5px",
              color: "#cbd5e1", // Muted premium silver text
              lineHeight: 1.45,
            }}
          >
            Are you sure you want to delete{" "}
            <strong style={{ color: "#f8fafc" }}>{pendingDealName}</strong>? This action cannot be
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
