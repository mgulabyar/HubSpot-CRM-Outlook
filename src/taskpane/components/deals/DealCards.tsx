import React, { useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Collapse,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
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

type DealCardProps = {
  dealId: string;
  properties: DealRecord["properties"];
  createdAt?: string;
  updatedAt?: string;
  isDeleting: boolean;
  onEdit: (dealId: string) => void;
  onDelete: (dealId: string) => void | Promise<void>;
};

const detailRowSx = {
  display: "flex",
  alignItems: "flex-start",
};

const detailLabelSx = {
  color: "#64748b",
  fontFamily: "Arial, sans-serif",
  fontWeight: 500,
  fontSize: "11.5px",
  width: "82px",
  flexShrink: 0,
};

const detailValueSx = {
  color: "#1e293b",
  fontFamily: "Arial",
  fontSize: "11.5px",
  textAlign: "left" as const,
  wordBreak: "break-word" as const,
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

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <Box sx={detailRowSx}>
      <Typography sx={detailLabelSx}>
        {label}
      </Typography>

      <Typography sx={detailValueSx}>
        {value || "—"}
      </Typography>
    </Box>
  );
}

function DealCard({
  dealId,
  properties,
  createdAt,
  updatedAt,
  isDeleting,
  onEdit,
  onDelete,
}: DealCardProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded((previous) => !previous);
  };

  const amount = properties.amount
    ? `$${properties.amount}`
    : undefined;

  return (
    <Card
      data-deal-id={dealId}
      elevation={0}
      sx={{
        border: "1px solid #e2e8f0",
        borderLeft: "3px solid #F5714E",
        borderRadius: "8px",
        bgcolor: "#ffffff",
        opacity: isDeleting ? 0.55 : 1,
        boxShadow:
          "0 2px 8px rgba(15, 23, 42, 0.06)",
        transition: "all 200ms ease",

        "&:hover": {
          bgcolor: "#ffffff",
          boxShadow:
            "0 3px 10px rgba(15, 23, 42, 0.09)",
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
        <Box
          onClick={toggleExpanded}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            cursor: "pointer",
          }}
        >
          <Box
            sx={{
              minWidth: 0,
              flex: 1,
            }}
          >
            <Typography
              sx={{
                color: "#1e293b",
                fontFamily: "Arial",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {properties.dealname || "Unnamed Deal"}
            </Typography>

          </Box>

          <IconButton
            type="button"
            size="small"
            aria-label={
              expanded
                ? "Collapse deal details"
                : "Expand deal details"
            }
            onClick={(event) => {
              event.stopPropagation();
              toggleExpanded();
            }}
            sx={{
              flexShrink: 0,
              color: "#64748b",
              p: 0.5,
              borderRadius: "6px",
              bgcolor:
                "rgba(245, 113, 78, 0.1)",
              transform: expanded
                ? "rotate(45deg)"
                : "rotate(0deg)",
              transition:
                "transform 200ms ease, background-color 200ms ease",

              "&:hover": {
                bgcolor:
                  "rgba(245, 113, 78, 0.2)",
                color: "#F5714E",
              },
            }}
          >
            <AddIcon
              sx={{
                fontSize: "16px",
              }}
            />
          </IconButton>
        </Box>

        <Collapse
          in={expanded}
          timeout={220}
          unmountOnExit
        >
          <Stack
            spacing={1.2}
            sx={{
              pt: 1.2,
            }}
          >
            <Box
              sx={{
                bgcolor: "#ffffff",
                border: "1px solid #e2e8f0",
                p: 1.2,
                borderRadius: "5px",
                display: "flex",
                flexDirection: "column",
                gap: 1.2,
              }}
            >
              <DetailRow
                label="ID"
                value={dealId}
              />

              <DetailRow
                label="Amount"
                value={amount}
              />

              <DetailRow
                label="Pipeline"
                value={properties.pipeline}
              />

              <DetailRow
                label="Stage"
                value={properties.dealstage}
              />

              <DetailRow
                label="Close Date"
                value={formatDate(
                  properties.closedate
                )}
              />

              {properties.description && (
                <DetailRow
                  label="Description"
                  value={properties.description}
                />
              )}
            </Box>

            <Divider
              sx={{
                borderColor: "#e2e8f0",
                my: 0.2,
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
                    color: "#64748b",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "10px",
                    display: "block",
                    lineHeight: 1.35,
                  }}
                >
                  Created: {formatDate(createdAt)}
                </Typography>

                <Typography
                  sx={{
                    color: "#64748b",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "10px",
                    display: "block",
                    lineHeight: 1.35,
                  }}
                >
                  Updated: {formatDate(updatedAt)}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 0.2,
                }}
              >
                <Tooltip
                  title="Edit deal"
                  arrow
                >
                  <IconButton
                    type="button"
                    size="small"
                    disabled={isDeleting}
                    aria-label="Edit deal"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      onEdit(dealId);
                    }}
                    sx={{
                      color: "#64748b",
                      p: 0.5,
                      borderRadius: "4px",

                      "&:hover": {
                        bgcolor:
                          "rgba(245, 113, 78, 0.12)",
                        color: "#F5714E",
                      },
                    }}
                  >
                    <EditOutlinedIcon
                      sx={{
                        fontSize: "15px",
                      }}
                    />
                  </IconButton>
                </Tooltip>

                <Tooltip
                  title="Delete deal"
                  arrow
                >
                  <IconButton
                    type="button"
                    size="small"
                    disabled={isDeleting}
                    aria-label="Delete deal"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      void onDelete(dealId);
                    }}
                    sx={{
                      color: "#64748b",
                      p: 0.5,
                      borderRadius: "4px",

                      "&:hover": {
                        bgcolor:
                          "rgba(220, 38, 38, 0.12)",
                        color: "#dc2626",
                      },
                    }}
                  >
                    <DeleteOutlineIcon
                      sx={{
                        fontSize: "15px",
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Stack>
        </Collapse>
      </CardContent>
    </Card>
  );
}

export default function DealCards({
  deals,
  loading,
  deletingId,
  onEdit,
  onDelete,
}: Props) {
  if (loading) {
    return (
      <Typography
        sx={{
          color: "#64748b",
          fontFamily: "Arial, sans-serif",
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
          color: "#64748b",
          fontFamily: "Arial, sans-serif",
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

        return (
          <DealCard
            key={dealId}
            dealId={dealId}
            properties={deal.properties}
            createdAt={deal.createdAt}
            updatedAt={deal.updatedAt}
            isDeleting={
              deletingId === dealId
            }
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </Stack>
  );
}
