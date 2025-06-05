import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaBars,
  FaFolderOpen,
  FaTimes,
  FaWrench,
} from "react-icons/fa";

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

export default function PilotProjectPage() {
  const { id } = useParams();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:3000/api/proyectos/${id}`)
      .then((res) => res.json())
      .then((data) => setProyecto(data))
      .catch((error) => {
        console.error("Error al obtener proyecto:", error);
      });
  }, [id]);

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
      <nav className="bg-[#1F384C] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src="/logo-round.png"
            alt="Logo"
            className="h-14 object-contain ml-6 sm:ml-10"
          />
          <span className="text-xl sm:text-2xl font-bold">AgroHawk</span>
        </div>

        <div className="mx-auto ml-auto text-lg font-semibold">Piloto</div>

        <div className="relative flex items-center gap-2">
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

      <div className="flex flex-1">
        <aside
          className={`$${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed z-50 top-0 left-0 min-h-screen w-64 bg-gray-100 p-4 border-r shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none`}
        >
          <nav className="space-y-4 mt-16 lg:mt-0">
            <div className="space-y-2">
              <SidebarButton label="Proyectos" icon={<FaFolderOpen />} active />
            </div>
            <hr className="my-4 border-gray-300" />
            <div className="space-y-2">
              <SidebarButton label="Configuración" icon={<FaWrench />} />
            </div>
          </nav>
        </aside>

        <button
          className="lg:hidden absolute top-4 left-2 z-50 text-white bg-blue-800 p-2 rounded-md shadow-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        <main className="flex-1 px-4 py-6 sm:px-6 md:px-8 bg-gray-50 flex flex-col items-center">
          {proyecto ? (
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">
              Nombre del Proyecto: {proyecto.nombre}
            </h1>
          ) : (
            <p className="text-gray-600 italic">Cargando proyecto...</p>
          )}
        </main>
      </div>
    </div>
  );
}
