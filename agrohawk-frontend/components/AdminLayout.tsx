import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  FaBars, FaBoxes, FaCalendarAlt, FaFileAlt, FaFolderOpen, FaTimes,
  FaUserAlt, FaUserShield, FaUserTie, FaUsers
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  current?: string; // para marcar el botón activo
};

type DecodedToken = {
  nombre: string;
  rol: string;
};

export default function AdminLayout({ children, current }: Props) {
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
          <img src="/logo-round.png" alt="Logo" className="mx-auto h-14 object-contain" />
          <span className="text-2xl font-bold">AgroHawk</span>
        </div>
        <div className="mx-auto ml-auto text-lg font-semibold">{traducirRol(rolUsuario)}</div>
        <div className="relative flex items-center gap-2">
          <span className="hidden sm:inline">Bienvenido, {nombreUsuario}</span>
          <button onClick={() => setMenuAbierto(!menuAbierto)} className="focus:outline-none focus:ring-0">
            <img src="/user-icon.png" alt="Perfil" className="h-10 w-10 rounded-full bg-white object-contain" />
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
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed z-50 top-0 left-0 min-h-screen w-64 bg-gray-100 p-4 border-r shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none`}
        >
          <nav className="space-y-4 mt-16 lg:mt-0">
            <div className="space-y-2">
              <SidebarButton label="Proyectos" icon={<FaFolderOpen />} active={current === "Proyectos"} to="/admin" />
              <SidebarButton label="Inventario" icon={<FaBoxes />} active={current === "Inventario"} to="/admin" />
              <SidebarButton label="Documentos" icon={<FaFileAlt />} active={current === "Documentos"} to="/admin" />
            </div>
            <hr className="my-4 border-gray-300" />
            <div className="space-y-2">
              <SidebarButton label="Administradores" icon={<FaUserShield />} active={current === "Administradores"} to="/admin-management" />
              <SidebarButton label="Gerente Operativo" icon={<FaUserTie />} active={current === "Gerente"} to="/admin" />
              <SidebarButton label="Pilotos" icon={<FaUserAlt />} active={current === "Pilotos"} to="/admin" />
              <SidebarButton label="Socios" icon={<FaUsers />} active={current === "Socios"} to="/admin" />
              <SidebarButton label="Calendario" icon={<FaCalendarAlt />} active={current === "Calendario"} to="/admin" />
            </div>
          </nav>
        </aside>

        {/* Botón hamburguesa */}
        <button
          className="lg:hidden absolute top-4 left-2 z-50 text-white bg-blue-800 p-2 rounded-md shadow-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* Contenido específico */}
        <main className="flex-1 p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
