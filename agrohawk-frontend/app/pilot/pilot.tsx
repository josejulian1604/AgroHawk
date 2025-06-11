import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaFolderOpen,
  FaTimes,
  FaWrench,
} from "react-icons/fa";

// Tipos

type DecodedToken = {
  id: string;
  nombre: string;
  rol: string;
};

type Proyecto = {
  _id: string;
  nombre: string;
  fecha: string;
  cliente: string;
  ubicacion: string;
  status: string;
  dron: {
    modelo: string;
    placa: string;
  };
  creadoPor: {
    nombre: string;
    apellido1: string;
  };
};

export default function Pilot() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [rolUsuario, setRolUsuario] = useState("");
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);

  const traducirRol = (rol: string) => {
    switch (rol) {
      case "admin":
        return "Administrador";
      case "gerente":
        return "Gerente Operativo";
      case "piloto":
        return "Piloto";
      case "socio":
        return "Socio";
      default:
        return rol.charAt(0).toUpperCase() + rol.slice(1);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setNombreUsuario(decoded.nombre);
        setRolUsuario(decoded.rol);

        if (!decoded.id) {
          console.error("⚠️ El token no contiene id");
          return;
        }

        fetch(`http://localhost:3000/api/proyectos/piloto/${decoded.id}`)
          .then((res) => res.json())
          .then((data) => {
            const proyectosFiltrados = (data.proyectos || data).filter(
              (proyecto: Proyecto) =>
                proyecto.status?.toLowerCase() !== "completado"
            );
            setProyectos(proyectosFiltrados);
          })
          .catch((error) => {
            console.error("Error al obtener proyectos del piloto:", error);
          });
      } catch (err) {
        console.error("⚠️ Error decodificando token:", err);
      }
    }
  }, []);

  function SidebarButton({
    label,
    icon,
    active = false,
  }: {
    label: string;
    icon: React.ReactNode;
    active?: boolean;
  }) {
    return (
      <button
        className={`flex items-center w-full px-3 py-2 text-left rounded-md transition-all duration-200 ${
          active
            ? "bg-blue-100 text-blue-700 font-semibold"
            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        }`}
      >
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* NavBar */}
      <nav className="bg-[#1F384C] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src="/logo-round.png"
            alt="Logo"
            className="h-14 object-contain ml-6 sm:ml-10"
          />
          <span className="text-xl sm:text-2xl font-bold">AgroHawk</span>
        </div>

        <div className="mx-auto ml-auto text-lg font-semibold">
          {traducirRol(rolUsuario)}
        </div>

        <div className="relative flex items-center gap-2">
          <span className="hidden sm:inline">Bienvenido, {nombreUsuario}</span>

          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="focus:outline-none focus:ring-0"
          >
            <img
              src="/user-icon.png"
              alt="Perfil"
              className="h-10 w-10 rounded-full bg-white object-contain"
            />
          </button>

          {menuAbierto && (
            <div className="absolute right-0 top-12 w-40 bg-white border rounded shadow-md z-50">
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="flex flex-1">
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed z-50 top-0 left-0 min-h-screen w-64 bg-gray-100 p-4 border-r shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none`}
        >
          <nav className="space-y-4 mt-16 lg:mt-0">
            <div className="space-y-2">
              <SidebarButton label="Proyectos" icon={<FaFolderOpen />} active />
            </div>

            <hr className="my-4 border-gray-300" />
          </nav>
        </aside>

        <button
          className="lg:hidden absolute top-4 left-2 z-50 text-white bg-blue-800 p-2 rounded-md shadow-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        <main className="flex-1 px-4 py-6 sm:px-6 md:px-8 bg-gray-50 flex flex-col items-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 text-center">
            Proyecto Asignado
          </h1>

          {proyectos.length === 0 ? (
            <p className="text-gray-600 text-base sm:text-lg italic text-center">
              No hay proyectos asignados.
            </p>
          ) : (
            <Link
              to={`/proyecto/${proyectos[0]._id}`}
              className="w-full max-w-2xl bg-white p-4 sm:p-6 rounded-lg shadow-md border flex flex-col sm:flex-row sm:justify-between gap-4 hover:shadow-lg transition"
            >
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
                  {proyectos[0].nombre}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  {new Date(proyectos[0].fecha).toLocaleDateString()}
                </p>
                <p className="mt-2 italic text-gray-700 text-sm sm:text-base">
                  Cliente: {proyectos[0].cliente}
                  <br />
                  Ubicación: {proyectos[0].ubicacion}
                </p>
                <div className="mt-4 border rounded p-2 bg-gray-100 text-center text-gray-800 text-sm sm:text-base">
                  Dron: {proyectos[0].dron.modelo} ({proyectos[0].dron.placa})
                </div>
              </div>

              <div className="flex justify-center sm:items-center">
                <div className="h-24 w-24 sm:h-28 sm:w-28 bg-gray-200 rounded-full flex items-center justify-center text-sm text-gray-800">
                  Gráfico
                </div>
              </div>
            </Link>
          )}
        </main>
      </div>
    </div>
  );
}
