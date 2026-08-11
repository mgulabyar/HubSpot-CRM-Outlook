// import React from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Chip,
//   Divider,
//   IconButton,
//   Stack,
//   Tooltip,
//   Typography,
// } from "@mui/material";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import DeleteOutlineIcon from "@mui/icons-material/Delete";

// import type { CompanyRecord } from "../../types/CompanyModels";

// type Props = {
//   companies: CompanyRecord[];
//   loading: boolean;
//   deletingId: string | null;
//   onEdit: (companyId: string) => void;
//   onDelete: (companyId: string) => Promise<void>;
// };

// function formatDate(value?: string) {
//   if (!value) {
//     return "Not available";
//   }

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) {
//     return "Not available";
//   }

//   return date.toLocaleString();
// }

// function InfoRow({ label, value }: { label: string; value?: string | null }) {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         alignItems: "flex-start",
//       }}
//     >
//       <Typography
//         sx={{
//           width: "100px",
//           flexShrink: 0,
//           color: "#cbd5e1",
//           fontSize: "11.5px",
//           fontWeight: 500,
//         }}
//       >
//         {label}
//       </Typography>

//       <Typography
//         sx={{
//           color: "#f8fafc",
//           fontSize: "11.5px",
//           wordBreak: "break-word",
//         }}
//       >
//         {value || "—"}
//       </Typography>
//     </Box>
//   );
// }

// export default function CompanyCards({ companies, loading, deletingId, onEdit, onDelete }: Props) {
//   if (loading) {
//     return (
//       <Typography
//         sx={{
//           color: "#94a3b8",
//           fontSize: "12px",
//         }}
//       >
//         Loading companies...
//       </Typography>
//     );
//   }

//   if (companies.length === 0) {
//     return (
//       <Typography
//         sx={{
//           color: "#94a3b8",
//           fontSize: "12px",
//         }}
//       >
//         No companies found in HubSpot.
//       </Typography>
//     );
//   }

//   return (
//     <Stack spacing={1.5}>
//       {companies.map((company) => {
//         const companyId = String(company.id);
//         const properties = company.properties;
//         const isDeleting = deletingId === companyId;

//         return (
//           <Card
//             key={companyId}
//             data-company-id={companyId}
//             elevation={0}
//             sx={{
//               border: "none",
//               borderLeft: "3px solid #F5714E",
//               borderRadius: "0px 8px 8px 0px",
//               bgcolor: "#1e293b",
//               opacity: isDeleting ? 0.55 : 1,
//               boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
//               transition: "all 200ms ease",
//               "&:hover": {
//                 bgcolor: "#243146",
//               },
//             }}
//           >
//             <CardContent
//               sx={{
//                 p: 1.5,
//                 "&:last-child": {
//                   pb: 1.5,
//                 },
//               }}
//             >
//               <Stack spacing={1.2}>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "flex-start",
//                     justifyContent: "space-between",
//                     gap: 1,
//                   }}
//                 >
//                   <Box sx={{ minWidth: 0 }}>
//                     <Typography
//                       sx={{
//                         color: "#f8fafc",
//                         fontWeight: 600,
//                         fontSize: "14.5px",
//                         lineHeight: 1.2,
//                         wordBreak: "break-word",
//                       }}
//                     >
//                       {properties.name || "Unnamed Company"}
//                     </Typography>

//                     <Typography
//                       sx={{
//                         display: "block",
//                         color: "#cbd5e1",
//                         fontSize: "11px",
//                         mt: 0.3,
//                       }}
//                     >
//                       ID: {companyId}
//                     </Typography>
//                   </Box>

//                   <Chip
//                     label="Company"
//                     size="small"
//                     sx={{
//                       height: 22,
//                       color: "#f8fafc",
//                       bgcolor: "#F5714E",
//                       fontSize: "9px",
//                       fontWeight: 700,
//                       textTransform: "uppercase",
//                     }}
//                   />
//                 </Box>

//                 <Box
//                   sx={{
//                     bgcolor: "#0f172a",
//                     p: 1.2,
//                     borderRadius: "6px",
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: 1.1,
//                   }}
//                 >
//                   <InfoRow label="Domain" value={properties.domain} />

//                   <InfoRow label="Phone" value={properties.phone} />

//                   <InfoRow label="Industry" value={properties.industry} />

//                   <InfoRow label="Employees" value={properties.numberofemployees} />

//                   <InfoRow label="City" value={properties.city} />

//                   <InfoRow label="State" value={properties.state} />

//                   <InfoRow label="Country" value={properties.country} />
//                 </Box>

//                 <Divider sx={{ borderColor: "#334155" }} />

//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   <Box>
//                     <Typography
//                       sx={{
//                         color: "#94a3b8",
//                         fontSize: "10px",
//                       }}
//                     >
//                       Created: {formatDate(company.createdAt)}
//                     </Typography>

//                     <Typography
//                       sx={{
//                         color: "#94a3b8",
//                         fontSize: "10px",
//                       }}
//                     >
//                       Updated: {formatDate(company.updatedAt)}
//                     </Typography>
//                   </Box>

//                   <Box sx={{ display: "flex" }}>
//                     <Tooltip title="Edit company" arrow>
//                       <IconButton
//                         type="button"
//                         size="small"
//                         disabled={isDeleting}
//                         onClick={(event) => {
//                           event.preventDefault();
//                           event.stopPropagation();
//                           onEdit(companyId);
//                         }}
//                         sx={{
//                           color: "#94a3b8",
//                           p: 0.5,
//                           "&:hover": {
//                             color: "#F5714E",
//                           },
//                         }}
//                       >
//                         <EditOutlinedIcon sx={{ fontSize: "15px" }} />
//                       </IconButton>
//                     </Tooltip>

//                     <Tooltip title="Delete company" arrow>
//                       <IconButton
//                         type="button"
//                         size="small"
//                         disabled={isDeleting}
//                         onClick={(event) => {
//                           event.preventDefault();
//                           event.stopPropagation();
//                           void onDelete(companyId);
//                         }}
//                         sx={{
//                           color: "#94a3b8",
//                           p: 0.5,
//                           "&:hover": {
//                             color: "#f87171",
//                           },
//                         }}
//                       >
//                         <DeleteOutlineIcon sx={{ fontSize: "15px" }} />
//                       </IconButton>
//                     </Tooltip>
//                   </Box>
//                 </Box>
//               </Stack>
//             </CardContent>
//           </Card>
//         );
//       })}
//     </Stack>
//   );
// }


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
        borderRadius: "10px",
        bgcolor: "#ffffff",
        opacity: isDeleting ? 0.55 : 1,
        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)",
        transition: "all 200ms ease",
        "&:hover": {
          bgcolor: "#f8fafc",
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
              fontFamily: "Arial, sans-serif",
              fontWeight: 600,
              fontSize: "14.5px",
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
                bgcolor: "#f8fafc",
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
                    fontFamily: "Arial, sans-serif",
                    fontSize: "10px",
                  }}
                >
                  Created: {formatDate(createdAt)}
                </Typography>

                <Typography
                  sx={{
                    color: "#64748b",
                    fontFamily: "Arial, sans-serif",
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
          fontFamily: "Arial, sans-serif",
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
          color: "#64748b",
          fontFamily: "Arial, sans-serif",
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
