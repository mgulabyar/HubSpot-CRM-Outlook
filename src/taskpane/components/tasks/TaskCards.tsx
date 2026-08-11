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

import type { TaskRecord } from "../../types/TaskModels";

type Props = {
  tasks: TaskRecord[];
  loading: boolean;
  deletingId: string | null;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => Promise<void>;
};

type TaskCardProps = {
  taskId: string;
  properties: TaskRecord["properties"];
  createdAt?: string;
  updatedAt?: string;
  isDeleting: boolean;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void | Promise<void>;
};

const detailRowSx = {
  display: "flex",
  alignItems: "flex-start",
};

const detailLabelSx = {
  width: "82px",
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
  whiteSpace: "pre-wrap" as const,
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

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <Box sx={detailRowSx}>
      <Typography sx={detailLabelSx}>{label}</Typography>

      <Typography sx={detailValueSx}>{value || "—"}</Typography>
    </Box>
  );
}

function TaskCard({
  taskId,
  properties,
  createdAt,
  updatedAt,
  isDeleting,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded((previous) => !previous);
  };

  return (
    <Card
      data-task-id={taskId}
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
                fontFamily: "Arial, sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {properties.hs_task_subject || "Untitled Task"}
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                fontFamily: "Arial, sans-serif",
                fontSize: "11px",
                mt: 0.3,
              }}
            >
              Task ID: {taskId}
            </Typography>
          </Box>

          <IconButton
            type="button"
            size="small"
            aria-label={expanded ? "Collapse task details" : "Expand task details"}
            onClick={(event) => {
              event.stopPropagation();
              toggleExpanded();
            }}
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
            <AddIcon
              sx={{
                fontSize: "16px",
              }}
            />
          </IconButton>
        </Box>

        <Collapse in={expanded} timeout={220} unmountOnExit>
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
              <DetailRow label="ID" value={taskId} />

              <DetailRow label="Status" value={properties.hs_task_status} />

              <DetailRow label="Priority" value={properties.hs_task_priority} />

              <DetailRow label="Type" value={properties.hs_task_type} />

              <DetailRow label="Due" value={formatDate(properties.hs_timestamp)} />

              <DetailRow label="Owner" value={properties.hubspot_owner_id} />

              {properties.hs_task_body && (
                <DetailRow label="Description" value={properties.hs_task_body} />
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
                <Tooltip title="Edit task" arrow>
                  <IconButton
                    type="button"
                    size="small"
                    disabled={isDeleting}
                    aria-label="Edit task"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      onEdit(taskId);
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
                    <EditOutlinedIcon
                      sx={{
                        fontSize: "15px",
                      }}
                    />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete task" arrow>
                  <IconButton
                    type="button"
                    size="small"
                    disabled={isDeleting}
                    aria-label="Delete task"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      void onDelete(taskId);
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

export default function TaskCards({ tasks, loading, deletingId, onEdit, onDelete }: Props) {
  if (loading) {
    return (
      <Typography
        sx={{
          color: "#64748b",
          fontFamily: "Arial, sans-serif",
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
          color: "#64748b",
          fontFamily: "Arial, sans-serif",
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

        return (
          <TaskCard
            key={taskId}
            taskId={taskId}
            properties={task.properties}
            createdAt={task.createdAt}
            updatedAt={task.updatedAt}
            isDeleting={deletingId === taskId}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </Stack>
  );
}
