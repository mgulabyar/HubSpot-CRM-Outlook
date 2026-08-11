import React, { useCallback, useState } from "react";
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

import type { AssociationFormValues, AssociationResult } from "../../types/AssociationModels";

import { getApiErrorMessage } from "../../utils/apiError";

type ToastSeverity = "success" | "error" | "info" | "warning";

export default function AssociationsSection() {
  const [associations, setAssociations] = useState<AssociationResult[]>([]);

  const [currentSearch, setCurrentSearch] = useState<AssociationFormValues | null>(null);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [pendingDelete, setPendingDelete] = useState<AssociationFormValues | null>(null);

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

  const loadAssociations = async (values: AssociationFormValues) => {
    try {
      setLoading(true);

      const response = await fetchAssociations(values.fromType, values.fromId, values.toType);

      setCurrentSearch(values);
      setAssociations(response.results || []);
    } catch (error) {
      console.error("[AssociationsSection] load failed:", error);

      showToast(getApiErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values: AssociationFormValues): Promise<boolean> => {
    try {
      setSaving(true);

      await createAssociation(values);

      await loadAssociations(values);

      showToast("Association created successfully.", "success");

      return true;
    } catch (error) {
      console.error("[AssociationsSection] create failed:", error);

      showToast(getApiErrorMessage(error), "error");

      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleRequestDelete = async (values: AssociationFormValues): Promise<void> => {
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

      showToast("Association deleted successfully.", "success");
    } catch (error) {
      console.error("[AssociationsSection] delete failed:", error);

      showToast(getApiErrorMessage(error), "error");
    } finally {
      setDeletingId(null);
      setPendingDelete(null);
    }
  };

  const pendingTargetId = pendingDelete?.toId || "";

//   return (
//     <>
//      <Stack spacing={1.5} sx={{ bgcolor: "#0f172a", p: 1, minHeight: "100vh" }}>
//  <AssociationCreateForm loading={saving} onSubmit={handleCreate} />

//   <Divider sx={{ borderColor: "#1e293b" }} />

//   <Box>
//     <Box
//       sx={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between", 
//         mb: 1.5,
//       }}
//     >
//       <Typography
//         sx={{
//           color: "#f8fafc",
//           fontWeight: 600,
//           fontSize: "13.5px",
//           letterSpacing: "0.2px",
//         }}
//       >
//         Existing Associations
//       </Typography>

//       <Chip
//         label={`${associations.length} Links`}
//         size="small"
//         variant="outlined"
//         sx={{
//           color: "#cbd5e1",
//           borderColor: "#334155",
//           bgcolor: "#1e293b", 
//           fontSize: "10.5px",
//           fontWeight: 600,
//           height: 24, 
//           borderRadius: "4px",
//           px: 0.5,
//         }}
//       />
//     </Box>

//     {currentSearch ? (
//       <AssociationCards
//         associations={associations}
//         source={currentSearch}
//         loading={loading}
//         deletingId={deletingId}
//         onDelete={handleRequestDelete}
//       />
//     ) : (
//       <Typography
//         sx={{
//           color: "#94a3b8",
//           fontSize: "11.5px",
//           lineHeight: 1.4,
//           p: 1.5,
//           bgcolor: "#1e293b",
//           borderRadius: "6px",
//           border: "1px dashed #334155",
//           textAlign: "center"
//         }}
//       >
//         Create an association to view linked records.
//       </Typography>
//     )}
//   </Box>
// </Stack>

//      <Dialog
//   open={Boolean(pendingDelete)}
//   onClose={deletingId ? undefined : handleCancelDelete}
//   maxWidth="xs"
//   fullWidth
//   // Safe strongly-typed slot override for deep dark dialog surface grid
//   slotProps={{
//     paper: {
//       sx: {
//         bgcolor: "#1e293b", // Matte slate surface container background
//         backgroundImage: "none", // Critical layout parameter to prevent MUI opacity tint bugs
//         borderRadius: "8px",
//         border: "1px solid #334155",
//       }
//     }
//   }}
// >
//   <DialogTitle 
//     sx={{ 
//       fontSize: "15px", 
//       fontWeight: 600, 
//       color: "#f8fafc", // Bright crisp white header text
//       pb: 1 
//     }}
//   >
//     Delete association
//   </DialogTitle>

//   <DialogContent sx={{ pb: 2 }}>
//     <DialogContentText 
//       sx={{ 
//         fontSize: "12.5px", 
//         color: "#cbd5e1", // Muted premium silver text
//         lineHeight: 1.45 
//       }}
//     >
//       Are you sure you want to remove association with record{" "}
//       <strong style={{ color: "#f8fafc" }}>{pendingTargetId}</strong>? This action cannot be undone.
//     </DialogContentText>
//   </DialogContent>

//   <DialogActions sx={{ px: 3, pb: 2, gap: 0.5 }}>
//     <Button
//       type="button"
//       disabled={Boolean(deletingId)}
//       onClick={handleCancelDelete}
//       sx={{ 
//         textTransform: "none", 
//         fontSize: "12.5px", 
//         color: "#94a3b8",
//         fontWeight: 500,
//         "&:hover": { bgcolor: "rgba(148, 163, 184, 0.08)" }
//       }}
//     >
//       Cancel
//     </Button>

//     <Button
//       type="button"
//       variant="contained"
//       color="error"
//       disabled={Boolean(deletingId)}
//       onClick={() => {
//         void handleConfirmDelete(); // Original function execution preserved safely
//       }}
//       sx={{ 
//         textTransform: "none", 
//         fontSize: "12.5px", 
//         fontWeight: 600,
//         borderRadius: "6px",
//         boxShadow: "none",
//         bgcolor: "#dc2626", // Solid flat corporate red
//         "&:hover": { bgcolor: "#b91c1c", boxShadow: "none" }
//       }}
//     >
//       {deletingId ? "Deleting..." : "Delete"}
//     </Button>
//   </DialogActions>
// </Dialog>


//       <Snackbar
//         open={toast.open}
//         autoHideDuration={3500}
//         onClose={closeToast}
//         anchorOrigin={{
//           vertical: "top",
//           horizontal: "right",
//         }}
//       >
//         <Alert
//           severity={toast.severity}
//           variant="filled"
//           onClose={closeToast}
//           sx={{
//             width: "100%",
//             fontSize: "12px",
//             borderRadius: "4px",
//           }}
//         >
//           {toast.message}
//         </Alert>
//       </Snackbar>
//     </>
//   );
return (
  <>
    <Stack
      spacing={1.5}
      sx={{
        bgcolor: "#ffffff",
        p: 1,
        minHeight: "auto",
        height: "auto",
      }}
    >
      <AssociationCreateForm
        loading={saving}
        onSubmit={handleCreate}
      />

      <Divider
        sx={{
          borderColor: "#e2e8f0",
        }}
      />

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
            variant="subtitle2"
            sx={{
              color: "#1e293b",
              fontFamily: "Arial, sans-serif",
              fontWeight: 500,
              fontSize: "13px",
              letterSpacing: "0.2px",
            }}
          >
            Existing Associations
          </Typography>

          <Chip
            label={`${associations.length} Links`}
            size="small"
            variant="outlined"
            sx={{
              color: "#475569",
              borderColor: "#cbd5e1",
              bgcolor: "#f1f5f9",
              fontFamily: "Arial, sans-serif",
              fontSize: "10.5px",
              fontWeight: 600,
              height: 24,
              borderRadius: "4px",
              px: 0.5,
            }}
          />
        </Box>

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
              color: "#64748b",
              fontFamily: "Arial, sans-serif",
              fontSize: "11.5px",
              lineHeight: 1.4,
              p: 1.5,
              bgcolor: "#f8fafc",
              borderRadius: "6px",
              border: "1px dashed #cbd5e1",
              textAlign: "center",
            }}
          >
            Create an association to view linked
            records.
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
      slotProps={{
        paper: {
          sx: {
            bgcolor: "#ffffff",
            backgroundImage: "none",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            boxShadow:
              "0 4px 12px rgba(0, 0, 0, 0.1)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: "Arial, sans-serif",
          fontSize: "14.5px",
          fontWeight: 500,
          color: "#1e293b",
          pb: 1,
        }}
      >
        Delete association
      </DialogTitle>

      <DialogContent
        sx={{
          pb: 2,
        }}
      >
        <DialogContentText
          sx={{
            fontFamily: "Arial, sans-serif",
            fontSize: "12.5px",
            color: "#475569",
            lineHeight: 1.45,
          }}
        >
          Are you sure you want to remove association
          with record{" "}
          <strong
            style={{
              color: "#1e293b",
            }}
          >
            {pendingTargetId}
          </strong>
          ? This action cannot be undone.
        </DialogContentText>
      </DialogContent>

      <DialogActions
        sx={{
          px: 1.5,
          pb: 1.5,
          gap: 0.5,
        }}
      >
        <Button
          type="button"
          disabled={Boolean(deletingId)}
          onClick={handleCancelDelete}
          sx={{
            textTransform: "none",
            fontFamily: "Arial, sans-serif",
            fontSize: "12.5px",
            color: "#64748b",
            fontWeight: 500,

            "&:hover": {
              bgcolor:
                "rgba(100, 116, 139, 0.08)",
            },
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
            fontFamily: "Arial, sans-serif",
            fontSize: "12.5px",
            fontWeight: 600,
            borderRadius: "6px",
            boxShadow: "none",
            bgcolor: "#dc2626",

            "&:hover": {
              bgcolor: "#b91c1c",
              boxShadow: "none",
            },
          }}
        >
          {deletingId
            ? "Deleting..."
            : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>

    <Snackbar
      open={toast.open}
      autoHideDuration={2500}
      onClose={closeToast}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      sx={{
        zIndex: 2000,
      }}
    >
      <Alert
        severity={toast.severity}
        variant="outlined"
        onClose={closeToast}
        sx={{
          width: "100%",
          fontFamily: "Arial, sans-serif",
          fontSize: "12px",
          borderRadius: "6px",
          bgcolor:
            toast.severity === "error"
              ? "#fef2f2"
              : "#fffbeb",
          color:
            toast.severity === "error"
              ? "#b91c1c"
              : "#92400e",
          borderColor:
            toast.severity === "error"
              ? "rgba(239, 68, 68, 0.35)"
              : "rgba(217, 119, 6, 0.35)",

          "& .MuiAlert-icon": {
            color:
              toast.severity === "error"
                ? "#dc2626"
                : "#d97706",
          },

          "& .MuiAlert-action": {
            color: "#64748b",
          },
        }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  </>
);
}
