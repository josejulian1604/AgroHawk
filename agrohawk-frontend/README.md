# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.

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
