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

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
      }}
    >
      <Typography
        sx={{
          width: "100px",
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

export default function CompanyCards({ companies, loading, deletingId, onEdit, onDelete }: Props) {
  if (loading) {
    return (
      <Typography
        sx={{
          color: "#94a3b8",
          fontSize: "12px",
        }}
      >
        Loading companies...
      </Typography>
    );
  }

  if (companies.length === 0) {
    return (
      <Typography
        sx={{
          color: "#94a3b8",
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
        const properties = company.properties;
        const isDeleting = deletingId === companyId;

        return (
          <Card
            key={companyId}
            data-company-id={companyId}
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
                      {properties.name || "Unnamed Company"}
                    </Typography>

                    <Typography
                      sx={{
                        display: "block",
                        color: "#cbd5e1",
                        fontSize: "11px",
                        mt: 0.3,
                      }}
                    >
                      ID: {companyId}
                    </Typography>
                  </Box>

                  <Chip
                    label="Company"
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
                  <InfoRow label="Domain" value={properties.domain} />

                  <InfoRow label="Phone" value={properties.phone} />

                  <InfoRow label="Industry" value={properties.industry} />

                  <InfoRow label="Employees" value={properties.numberofemployees} />

                  <InfoRow label="City" value={properties.city} />

                  <InfoRow label="State" value={properties.state} />

                  <InfoRow label="Country" value={properties.country} />
                </Box>

                <Divider sx={{ borderColor: "#334155" }} />

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
                      Created: {formatDate(company.createdAt)}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#94a3b8",
                        fontSize: "10px",
                      }}
                    >
                      Updated: {formatDate(company.updatedAt)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex" }}>
                    <Tooltip title="Edit company" arrow>
                      <IconButton
                        type="button"
                        size="small"
                        disabled={isDeleting}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          onEdit(companyId);
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

                    <Tooltip title="Delete company" arrow>
                      <IconButton
                        type="button"
                        size="small"
                        disabled={isDeleting}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          void onDelete(companyId);
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
