import { type RouteConfig, index } from "@react-router/dev/routes";

export default [index("routes/home.tsx"),
  {
    path: "login",
    file: "routes/login.tsx",
  },
  {
    path: "forgot-password",
    file: "routes/forgot-password.tsx"
  },
  {
    path: "admin",
    file: "admin/AdminPage.tsx",
  },
  {
    path: "piloto",
    file: "pilot/pilot.tsx",
  },
  {
    path: "socio",
    file: "stakeholder/stakeholder.tsx",
  },
  {
    path: "gerente",
    file: "operative-manager/manager.tsx",
  },
  {
    path: "admin-management",
    file: "admin/AdminCrud.tsx",
  },
] satisfies RouteConfig;
