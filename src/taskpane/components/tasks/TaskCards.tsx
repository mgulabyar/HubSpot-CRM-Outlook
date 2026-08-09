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

import type {
  TaskRecord,
} from "../../types/TaskModels";

type Props = {
  tasks: TaskRecord[];
  loading: boolean;
  deletingId: string | null;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => Promise<void>;
};

function formatDate(value?: string | null) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString();
}

function Row({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
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
          whiteSpace: "pre-wrap",
        }}
      >
        {value || "—"}
      </Typography>
    </Box>
  );
}

export default function TaskCards({
  tasks,
  loading,
  deletingId,
  onEdit,
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
        Loading tasks...
      </Typography>
    );
  }

  if (tasks.length === 0) {
    return (
      <Typography
        sx={{
          color: "#94a3b8",
          fontSize: "12px",
        }}
      >
        No tasks found in HubSpot.
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5}>
      {tasks.map((task) => {
        const taskId = String(task.id);
        const properties = task.properties;
        const isDeleting =
          deletingId === taskId;

        return (
          <Card
            key={taskId}
            data-task-id={taskId}
            elevation={0}
            sx={{
              border: "none",
              borderLeft: "3px solid #F5714E",
              borderRadius: "0px 8px 8px 0px",
              bgcolor: "#1e293b",
              opacity: isDeleting ? 0.55 : 1,
              boxShadow:
                "0 4px 12px rgba(0, 0, 0, 0.15)",
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
                      {properties.hs_task_subject ||
                        "Untitled Task"}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#cbd5e1",
                        fontSize: "11px",
                        mt: 0.3,
                      }}
                    >
                      ID: {taskId}
                    </Typography>
                  </Box>

                  <Chip
                    label="Task"
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
                    label="Status"
                    value={
                      properties.hs_task_status
                    }
                  />

                  <Row
                    label="Priority"
                    value={
                      properties.hs_task_priority
                    }
                  />

                  <Row
                    label="Type"
                    value={properties.hs_task_type}
                  />

                  <Row
                    label="Due"
                    value={formatDate(
                      properties.hs_timestamp
                    )}
                  />

                  <Row
                    label="Owner"
                    value={
                      properties.hubspot_owner_id
                    }
                  />

                  {properties.hs_task_body && (
                    <Row
                      label="Description"
                      value={
                        properties.hs_task_body
                      }
                    />
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
                      Created:{" "}
                      {formatDate(task.createdAt)}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#94a3b8",
                        fontSize: "10px",
                      }}
                    >
                      Updated:{" "}
                      {formatDate(task.updatedAt)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex" }}>
                    <Tooltip title="Edit task" arrow>
                      <IconButton
                        type="button"
                        size="small"
                        disabled={isDeleting}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          onEdit(taskId);
                        }}
                        sx={{
                          color: "#94a3b8",
                          p: 0.5,
                          "&:hover": {
                            color: "#F5714E",
                          },
                        }}
                      >
                        <EditOutlinedIcon
                          sx={{ fontSize: "15px" }}
                        />
                      </IconButton>
                    </Tooltip>

                    <Tooltip
                      title="Delete task"
                      arrow
                    >
                      <IconButton
                        type="button"
                        size="small"
                        disabled={isDeleting}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          void onDelete(taskId);
                        }}
                        sx={{
                          color: "#94a3b8",
                          p: 0.5,
                          "&:hover": {
                            color: "#f87171",
                          },
                        }}
                      >
                        <DeleteOutlineIcon
                          sx={{ fontSize: "15px" }}
                        />
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