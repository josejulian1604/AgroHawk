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
    file: "operative-manager/ManagerPage.tsx",
  },
  {
    path: "admin-management",
    file: "admin/AdminCrud.tsx",
  },
  {
    path: "gerente-management",
    file: "admin/GerenteCrud.tsx",
  },
  {
    path: "socio-management",
    file: "admin/SocioCrud.tsx",
  },
  {
    path: "piloto-management",
    file: "admin/PilotoCrud.tsx",
  },
  {
    path: "proyectos/:id",
    file: "admin/ProjectDetails.tsx",
  },
  {
    path: "inventario",
    file: "admin/DronesInventory.tsx",
  },
  {
    path: "/proyecto/:id",
    file: "pilot/pilotActions.tsx"
  },
  {
    path: "documentos",
    file: "admin/DocumentosHome.tsx",
  },
  {
    path: "documentos/:tipo",
    file: "admin/DocumentosPorTipo.tsx",
  },
  {
    path: "documentos/reportes-operativos",
    file: "admin/DocumentosOperativos.tsx",
  },
  {
    path: "calendario",
    file: "admin/Calendar.tsx",
  },
  {
    path: "proyecto-gerente/:id",
    file: "operative-manager/ManagerProject.tsx",
  },
  {
    path: "calendario-gerente",
    file: "operative-manager/ManagerCalendar.tsx",
  },
  {
    path: "reset-password/:id",
    file: "routes/ResetPassword.tsx",
  },
] satisfies RouteConfig;
