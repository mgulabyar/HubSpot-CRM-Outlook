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

import type { CompanyRecord } from "../../types/CompanyModels";

type Props = {
  companies: CompanyRecord[];
  loading: boolean;
  deletingId: string | null;
  onEdit: (companyId: string) => void;
  onDelete: (companyId: string) => Promise<void>;
};

function formatDate(value?: string) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString();
}

const detailLabelSx = {
  width: "80px",
  flexShrink: 0,
  color: "#64748b",
  fontFamily: "Arial, sans-serif",
  fontSize: "11.5px",
  fontWeight: 500,
};

const detailValueSx = {
  color: "#1e293b",
  fontFamily: "Arial, sans-serif",
  fontSize: "11.5px",
  wordBreak: "break-word" as const,
};

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
      }}
    >
      <Typography sx={detailLabelSx}>{label}</Typography>
      <Typography sx={detailValueSx}>{value || "—"}</Typography>
    </Box>
  );
}

type CompanyCardProps = {
  companyId: string;
  properties: CompanyRecord["properties"];
  isDeleting: boolean;
  createdAt?: string;
  updatedAt?: string;
  onEdit: (companyId: string) => void;
  onDelete: (companyId: string) => Promise<void>;
};

function CompanyCard({
  companyId,
  properties,
  isDeleting,
  createdAt,
  updatedAt,
  onEdit,
  onDelete,
}: CompanyCardProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded((previous) => !previous);

  return (
    <Card
      key={companyId}
      data-company-id={companyId}
      elevation={0}
      sx={{
        border: "1px solid #e2e8f0",
        borderLeft: "3px solid #F5714E",
        borderRadius: "8px",
        bgcolor: "#ffffff",
        opacity: isDeleting ? 0.55 : 1,
        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)",
        transition: "all 200ms ease",
        "&:hover": {
          bgcolor: "#fff",
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
              minWidth: 0,
              flex: 1,
            }}
          >
            {properties.name || "Unnamed Company"}
          </Typography>

          <IconButton
            type="button"
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              toggleExpanded();
            }}
            aria-label={expanded ? "Collapse company details" : "Expand company details"}
            sx={{
              flexShrink: 0,
              color: "#64748b",
              p: 0.5,
              borderRadius: "6px",
              bgcolor: "rgba(245, 113, 78, 0.1)",
              transform: expanded ? "rotate(45deg)" : "rotate(0deg)",
              transition: "transform 200ms ease, background-color 200ms ease",
              "&:hover": {
                bgcolor: "rgba(245, 113, 78, 0.2)",
                color: "#F5714E",
              },
            }}
          >
            <AddIcon sx={{ fontSize: "16px" }} />
          </IconButton>
        </Box>

        <Collapse in={expanded} timeout={220} unmountOnExit>
          <Stack spacing={1.2} sx={{ pt: 1.2 }}>
            <Box
              sx={{
                bgcolor: "#fff",
                border: "1px solid #e2e8f0",
                p: 1.2,
                borderRadius: "6px",
                display: "flex",
                flexDirection: "column",
                gap: 1.1,
              }}
            >
              <InfoRow label="ID" value={companyId} />
              <InfoRow label="Domain" value={properties.domain} />
              <InfoRow label="Phone" value={properties.phone} />
              <InfoRow label="Industry" value={properties.industry} />
              <InfoRow label="Employees" value={properties.numberofemployees} />
              <InfoRow label="City" value={properties.city} />
              <InfoRow label="State" value={properties.state} />
              <InfoRow label="Country" value={properties.country} />
            </Box>

            <Divider sx={{ borderColor: "#e2e8f0" }} />

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
                    fontFamily: "Arial",
                    fontSize: "10px",
                  }}
                >
                  Created: {formatDate(createdAt)}
                </Typography>

                <Typography
                  sx={{
                    color: "#64748b",
                    fontFamily: "Arial",
                    fontSize: "10px",
                  }}
                >
                  Updated: {formatDate(updatedAt)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 0.2 }}>
                <Tooltip title="Edit company" arrow>
                  <IconButton
                    type="button"
                    size="small"
                    disabled={isDeleting}
                    aria-label="Edit company"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      onEdit(companyId);
                    }}
                    sx={{
                      color: "#64748b",
                      p: 0.5,
                      borderRadius: "4px",
                      "&:hover": {
                        bgcolor: "rgba(245, 113, 78, 0.12)",
                        color: "#F5714E",
                      },
                    }}
                  >
                    <EditOutlinedIcon sx={{ fontSize: "15px" }} />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete company" arrow>
                  <IconButton
                    type="button"
                    size="small"
                    disabled={isDeleting}
                    aria-label="Delete company"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      void onDelete(companyId);
                    }}
                    sx={{
                      color: "#64748b",
                      p: 0.5,
                      borderRadius: "4px",
                      "&:hover": {
                        bgcolor: "rgba(220, 38, 38, 0.12)",
                        color: "#dc2626",
                      },
                    }}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: "15px" }} />
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

export default function CompanyCards({ companies, loading, deletingId, onEdit, onDelete }: Props) {
  if (loading) {
    return (
      <Typography
        sx={{
          color: "#64748b",
          fontFamily: "Arial",
          fontSize: "12px",
        }}
      >
        Loading companies...
      </Typography>
    );
  }
// 
  if (companies.length === 0) {
    return (
      <Typography
        sx={{
          color: "#64748b",
          fontFamily: "Arial",
          fontSize: "12px",
        }}
      >
        No companies found in HubSpot.
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5}>
      {companies.map((company) => {
        const companyId = String(company.id);
        const isDeleting = deletingId === companyId;

        return (
          <CompanyCard
            key={companyId}
            companyId={companyId}
            properties={company.properties}
            isDeleting={isDeleting}
            createdAt={company.createdAt}
            updatedAt={company.updatedAt}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </Stack>
  );
}
