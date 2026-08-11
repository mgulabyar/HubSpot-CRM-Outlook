import React from "react";

import { Card, CardContent, IconButton, Stack, Tooltip, Typography } from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/Delete";

import type { AssociationResult, AssociationFormValues } from "../../types/AssociationModels";

type Props = {
  associations: AssociationResult[];
  source: AssociationFormValues;
  loading: boolean;
  deletingId: string | null;
  onDelete: (values: AssociationFormValues) => Promise<void>;
};

export default function AssociationCards({
  associations,
  source,
  loading,
  deletingId,
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
        Loading associations...
      </Typography>
    );
  }

  if (associations.length === 0) {
    return (
      <Typography
        sx={{
          color: "#64748b",
          fontFamily: "Arial, sans-serif",
          fontSize: "12px",
        }}
      >
        No associations found for this source record.
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5}>
      {associations.map((association, index) => {
        const targetId = String(association.toObjectId || association.id || "").trim();

        const key = `${targetId}-${index}`;

        return (
          <Card
            key={key}
            data-association-id={targetId}
            elevation={0}
            sx={{
              border: "1px solid #e2e8f0",
              borderLeft: "3px solid #F5714E",
              borderRadius: "8px",
              bgcolor: "#ffffff",
              boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)",
              transition: "all 200ms ease",

              "&:hover": {
                bgcolor: "#ffffff",
                boxShadow: "0 3px 10px rgba(15, 23, 42, 0.09)",
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
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Stack
                  spacing={0.4}
                  sx={{
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#1e293b",
                      fontFamily: "Arial, sans-serif",
                      fontSize: "13px",
                      fontWeight: 500,
                      lineHeight: 1.2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {source.toType || "Association"}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748b",
                      fontFamily: "Arial, sans-serif",
                      fontSize: "11px",
                      wordBreak: "break-all",
                    }}
                  >
                    Associated ID: {targetId || "—"}
                  </Typography>
                </Stack>

                <Tooltip title="Delete association" arrow>
                  <IconButton
                    type="button"
                    size="small"
                    disabled={deletingId === targetId}
                    aria-label="Delete association"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();

                      void onDelete({
                        ...source,
                        toId: targetId,
                      });
                    }}
                    sx={{
                      flexShrink: 0,
                      color: "#64748b",
                      p: 0.5,
                      borderRadius: "4px",

                      "&:hover": {
                        bgcolor: "rgba(220, 38, 38, 0.12)",
                        color: "#dc2626",
                      },

                      "&.Mui-disabled": {
                        color: "#cbd5e1",
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
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}
