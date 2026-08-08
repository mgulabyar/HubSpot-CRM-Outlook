import React, { useState } from "react";
import { Box, Card, Stack, Tab, Tabs, Typography } from "@mui/material";

import ContactsPage from "./contacts/ContactsPage";
import CompaniesSection from "./companies/CompaniesSection";
import DealsSection from "./deals/DealsSection";

type CrmTabValue = "contacts" | "companies" | "deals" | "tasks" | "associations";

type CrmTab = {
  value: CrmTabValue;
  label: string;
};

const crmTabs: CrmTab[] = [
  {
    value: "contacts",
    label: "Contacts",
  },
  {
    value: "companies",
    label: "Companies",
  },
  {
    value: "deals",
    label: "Deals",
  },
  {
    value: "tasks",
    label: "Tasks",
  },
  {
    value: "associations",
    label: "Associations",
  },
];

function ComingSoonSection({ title, description }: { title: string; description: string }) {
  return (
    <Box
      sx={{
        minHeight: 260,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Stack
        spacing={1}
        sx={{
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            color: "#f8fafc",
            fontSize: "16px",
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: "#94a3b8",
            fontSize: "12px",
            maxWidth: 280,
          }}
        >
          {description}
        </Typography>

        <Box
          sx={{
            mt: 1,
            px: 1.5,
            py: 0.7,
            borderRadius: "5px",
            color: "#F5714E",
            bgcolor: "rgba(245, 113, 78, 0.1)",
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          Coming next
        </Box>
      </Stack>
    </Box>
  );
}

function renderTabContent(value: CrmTabValue) {
  switch (value) {
    case "contacts":
      return <ContactsPage />;

    case "companies":
      return <CompaniesSection />;

    case "deals":
      return <DealsSection />;

    case "tasks":
      return (
        <ComingSoonSection
          title="Tasks"
          description="Create, assign, complete and manage CRM tasks here."
        />
      );

    case "associations":
      return (
        <ComingSoonSection
          title="Associations"
          description="Link contacts, companies, deals and tasks together."
        />
      );

    default:
      return null;
  }
}

export default function CrmWorkspace() {
  const [activeTab, setActiveTab] = useState<CrmTabValue>("contacts");

  const handleTabChange = (_event: React.SyntheticEvent, value: CrmTabValue) => {
    setActiveTab(value);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          minWidth: 0,
          overflow: "hidden",
          borderRadius: "5px",
        }}
      >
        <Box
          sx={{
            px: 1.2,
            pt: 1.2,
            borderBottom: "1px solid #263449",
            bgcolor: "#172033",
          }}
        >
          <Typography
            sx={{
              px: 0.8,
              pb: 1,
              color: "#f8fafc",
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "0.1px",
            }}
          >
            CRM Workspace
          </Typography>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons={false}
            aria-label="CRM sections"
            sx={{
              minHeight: "42px",
              width: "100%",

              "& .MuiTabs-flexContainer": {
                gap: 0.5,
              },

              "& .MuiTabs-indicator": {
                height: "3px",
                borderRadius: "3px 3px 0 0",
                bgcolor: "#F5714E",
              },

              "& .MuiTabs-scroller": {
                overflowX: "auto !important",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              },

              "& .MuiTabs-scroller::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {crmTabs.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                disableRipple
                sx={{
                  minHeight: "32px",
                  minWidth: "auto",
                  px: 1.2,
                  py: 0.7,
                  color: "#94a3b8",
                  textTransform: "none",
                  fontSize: "11.5px",
                  fontWeight: 600,
                  borderRadius: "5px 5px 0 0",
                  transition: "color 160ms ease, background-color 160ms ease",

                  "&:hover": {
                    color: "#f8fafc",
                    bgcolor: "rgba(245, 113, 78, 0.08)",
                  },

                  "&.Mui-selected": {
                    color: "#F5714E",
                    bgcolor: "rgba(245, 113, 78, 0.08)",
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>

        <Box
          sx={{
            p: 1.5,
            minHeight: 400,
            bgcolor: "#0f172a",
            overflowX: "hidden",
          }}
        >
          {renderTabContent(activeTab)}
        </Box>
      </Card>
    </Box>
  );
}
