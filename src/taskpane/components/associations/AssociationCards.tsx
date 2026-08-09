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
          color: "#94a3b8",
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
          color: "#94a3b8",
          fontSize: "12px",
        }}
      >
        No associations found for this source record.
      </Typography>
    );
  }

  return (
    <Stack spacing={1}>
      {associations.map((association, index) => {
        const targetId = association.toObjectId || association.id || "";

        const key = `${targetId}-${index}`;

        return (
          <Card
            key={key}
            elevation={0}
            sx={{
              border: "none",
              borderLeft: "3px solid #F5714E",
              borderRadius: "0 8px 8px 0",
              bgcolor: "#1e293b",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          >
            <CardContent
              sx={{
                p: 1.3,
                "&:last-child": {
                  pb: 1.3,
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
                <Stack spacing={0.4}>
                  <Typography
                    sx={{
                      color: "#f8fafc",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {source.toType}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#cbd5e1",
                      fontSize: "11px",
                    }}
                  >
                    Associated ID: {targetId}
                  </Typography>
                </Stack>

                <Tooltip title="Delete association" arrow>
                  <IconButton
                    type="button"
                    size="small"
                    disabled={deletingId === targetId}
                    onClick={() => {
                      void onDelete({
                        ...source,
                        toId: targetId,
                      });
                    }}
                    sx={{
                      color: "#94a3b8",
                      p: 0.5,
                      borderRadius: "4px",
                      "&:hover": {
                        color: "#f87171",
                        bgcolor: "rgba(248, 113, 113, 0.08)",
                      },
                    }}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: "16px" }} />
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
