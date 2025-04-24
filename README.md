# AgroHawk-frontend

# Estructura general del proyecto
/agrohawk-frontend
├── /app                           # Carpeta principal para rutas y layout
│   ├── /routes                    # Rutas principales del sistema
│   │   ├── home.tsx              # Ruta pública principal
│   │   ├── login.tsx             # Ruta de login
│   │   └── ...                   # Otras rutas generales
│   ├── /welcome                  # Página de bienvenida o landing
│   │   ├── welcome.tsx
│   │   ├── logo-dark.svg
│   │   └── logo-light.svg
│   ├── /admin                    # Vistas de administrador
│   │   ├── dashboard.tsx
│   │   ├── projects.tsx
│   │   └── reports.tsx
│   ├── /pilot                    # Vistas de pilotos
│   │   ├── dashboard.tsx
│   │   └── upload-report.tsx
│   ├── /stakeholder             # Vistas de socios
│   │   ├── dashboard.tsx
│   │   └── reports.tsx
│   ├── /manager                 # Vistas de gerente operativo
│   │   ├── dashboard.tsx
│   │   └── verify.tsx
│   ├── root.tsx                  # Layout raíz de la app
│   ├── routes.ts                 # Declaración del árbol de rutas
│   └── app.css                   # Estilos globales
│
├── /components                   # Componentes reutilizables
│   ├── Sidebar/
│   ├── Button/
│   └── Card/
│
├── /assets                       # Imágenes y recursos generales
│   └── logo.png
│
├── /services                     # API calls organizadas
│   ├── authService.ts
│   ├── projectService.ts
│   └── ...
│
├── /hooks                        # Custom hooks
│   └── useAuth.ts
│
├── /contexts                     # Contextos globales
│   └── AuthContext.tsx
│
├── /styles                       # CSS o Tailwind base
│   └── index.css
│
├── /public                       # Archivos estáticos
│   └── favicon.ico
│
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── react-router.config.ts
└── README.md