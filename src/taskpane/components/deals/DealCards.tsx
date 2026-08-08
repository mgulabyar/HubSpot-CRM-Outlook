import React from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/Delete";

import type { DealRecord } from "../../types/DealModels";

type Props = {
  deals: DealRecord[];
  loading: boolean;
  deletingId: string | null;
  onEdit: (dealId: string) => void;
  onDelete: (dealId: string) => Promise<void>;
};

function formatDate(value?: string | null) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString();
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
      }}
    >
      <Typography
        sx={{
          width: "82px",
          flexShrink: 0,
          color: "#cbd5e1",
          fontSize: "11.5px",
          fontWeight: 500,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          color: "#f8fafc",
          fontSize: "11.5px",
          wordBreak: "break-word",
        }}
      >
        {value || "—"}
      </Typography>
    </Box>
  );
}

export default function DealCards({ deals, loading, deletingId, onEdit, onDelete }: Props) {
  if (loading) {
    return (
      <Typography
        sx={{
          color: "#94a3b8",
          fontSize: "12px",
        }}
      >
        Loading deals...
      </Typography>
    );
  }

  if (deals.length === 0) {
    return (
      <Typography
        sx={{
          color: "#94a3b8",
          fontSize: "12px",
        }}
      >
        No deals found in HubSpot.
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5}>
      {deals.map((deal) => {
        const dealId = String(deal.id);
        const properties = deal.properties;
        const isDeleting = deletingId === dealId;

        return (
          <Card
            key={dealId}
            data-deal-id={dealId}
            elevation={0}
            sx={{
              border: "none",
              borderLeft: "3px solid #F5714E",
              borderRadius: "0px 8px 8px 0px",
              bgcolor: "#1e293b",
              opacity: isDeleting ? 0.55 : 1,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              transition: "all 200ms ease",
              "&:hover": {
                bgcolor: "#243146",
              },
            }}
          >
            <CardContent
              sx={{
                p: 1.5,
                "&:last-child": {
                  pb: 1.5,
                },
              }}
            >
              <Stack spacing={1.2}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        color: "#f8fafc",
                        fontWeight: 600,
                        fontSize: "14.5px",
                        lineHeight: 1.2,
                        wordBreak: "break-word",
                      }}
                    >
                      {properties.dealname || "Unnamed Deal"}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#cbd5e1",
                        fontSize: "11px",
                        mt: 0.3,
                      }}
                    >
                      ID: {dealId}
                    </Typography>
                  </Box>

                  <Chip
                    label="Deal"
                    size="small"
                    sx={{
                      height: 22,
                      color: "#f8fafc",
                      bgcolor: "#F5714E",
                      fontSize: "9px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    bgcolor: "#0f172a",
                    p: 1.2,
                    borderRadius: "6px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.1,
                  }}
                >
                  <Row
                    label="Amount"
                    value={properties.amount ? `$${properties.amount}` : undefined}
                  />

                  <Row label="Pipeline" value={properties.pipeline} />

                  <Row label="Stage" value={properties.dealstage} />

                  <Row label="Close Date" value={formatDate(properties.closedate)} />

                  {properties.description && (
                    <Row label="Description" value={properties.description} />
                  )}
                </Box>

                <Divider
                  sx={{
                    borderColor: "#334155",
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color: "#94a3b8",
                        fontSize: "10px",
                      }}
                    >
                      Created: {formatDate(deal.createdAt)}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#94a3b8",
                        fontSize: "10px",
                      }}
                    >
                      Updated: {formatDate(deal.updatedAt)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex" }}>
                    <Tooltip title="Edit deal" arrow>
                      <IconButton
                        type="button"
                        size="small"
                        disabled={isDeleting}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          onEdit(dealId);
                        }}
                        sx={{
                          color: "#94a3b8",
                          p: 0.5,
                          "&:hover": {
                            color: "#F5714E",
                          },
                        }}
                      >
                        <EditOutlinedIcon sx={{ fontSize: "15px" }} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete deal" arrow>
                      <IconButton
                        type="button"
                        size="small"
                        disabled={isDeleting}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          void onDelete(dealId);
                        }}
                        sx={{
                          color: "#94a3b8",
                          p: 0.5,
                          "&:hover": {
                            color: "#f87171",
                          },
                        }}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: "15px" }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}
