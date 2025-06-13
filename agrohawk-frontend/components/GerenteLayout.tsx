import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  FaBars, FaCalendarAlt, FaFolderOpen, FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  current?: string; // para marcar el botón activo
};

type DecodedToken = {
  nombre: string;
  rol: string;
  apellido1: string;
};

export default function GerenteLayout({ children, current }: Props) {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [rolUsuario, setRolUsuario] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function SidebarButton({ label, icon, active = false, to, }: { label: string; icon: React.ReactNode; active?: boolean; to?: string; }) {
  return (
      <button
        onClick={() => to && navigate(to)}
        className={`flex items-center w-full px-3 py-2 text-left rounded-md transition-all duration-200 ${
          active ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        }`}
      >
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </button>
    );
  }

  const traducirRol = (rol: string) => {
    switch (rol) {
      case "admin": return "Administrador";
      case "gerente": return "Gerente Operativo";
      case "piloto": return "Piloto";
      case "socio": return "Socio";
      default: return rol;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      setNombreUsuario(decoded.nombre);
      setRolUsuario(decoded.rol);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-[#1F384C] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            className="lg:hidden mr-2 text-white bg-blue-800 p-2 rounded-md shadow-md hover:bg-[#1F389C] transition-colors duration-200"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <img src="/logo-round.png" alt="Logo" className="mx-auto h-14 object-contain" />
          <span className="text-2xl font-bold">AgroHawk</span>
        </div>
        <div className="hidden sm:block mx-auto ml-auto text-lg font-semibold">{traducirRol(rolUsuario)}</div>
        <div className="relative flex items-center gap-2">
          <span className="hidden sm:block">Bienvenido, {nombreUsuario}</span>
          <button onClick={() => setMenuAbierto(!menuAbierto)} className="focus:outline-none focus:ring-0">
            <img src="/user-icon.png" alt="Perfil" className="h-10 w-10 rounded-full bg-white object-contain" />
          </button>
          {menuAbierto && (
            <div className="absolute right-0 top-12 w-40 bg-white border rounded shadow-md z-50">
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
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
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed z-50 top-0 left-0 min-h-screen w-64 bg-gray-100 p-4 border-r shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none`}
        >
          <button
            className="absolute top-4 left-4 z-50 text-white bg-[#1F384C] p-2 rounded-md shadow hover:bg-[#1F389C] transition-colors duration-200 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            <FaTimes size={24} />
          </button>


          <nav className="space-y-4 mt-16 lg:mt-0">
            <div className="space-y-2">
              <SidebarButton label="Proyectos" icon={<FaFolderOpen />} active={current === "Proyectos"} to="/gerente" />
            </div>
            <hr className="my-4 border-gray-300" />
            <div className="space-y-2">
              <SidebarButton label="Calendario" icon={<FaCalendarAlt />} active={current === "Calendario"} to="/calendario-gerente" />
            </div>
          </nav>
        </aside>

        

        {/* Contenido específico */}
        <main className="flex-1 p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}