import { jwtDecode } from "jwt-decode"; 
import { useEffect, useState } from "react";
import { FaBars, FaBoxes, FaCalendarAlt, FaFileAlt, FaFolderOpen, FaTimes, FaUserAlt, FaWrench } from "react-icons/fa";
import { FaProjectDiagram, FaWarehouse, FaRegFileAlt, FaUserShield, FaUserTie, FaPlaneDeparture, FaUsers, FaRegCalendarAlt } from "react-icons/fa";

type DecodedToken = {
  nombre: string;
  rol: string;
};

export default function Pilot() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [rolUsuario, setRolUsuario] = useState("");

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
        return rol.charAt(0).toUpperCase() + rol.slice(1); // capitaliza cualquier otro
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

  function SidebarButton({ label, icon, active = false }: { label: string; icon: React.ReactNode; active?: boolean }) {
    return (
      <button
        className={`flex items-center w-full px-3 py-2 text-left rounded-md transition-all duration-200 ${
          active ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
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
          <img src="/logo-round.png" alt="Logo" className="mx-auto h-14 object-contain" />
          <span className="text-2xl font-bold">AgroHawk</span>
        </div>

        <div className="mx-auto ml-auto text-lg font-semibold">{traducirRol(rolUsuario)}</div>

        <div className="relative flex items-center gap-2">
          <span className="hidden sm:inline">Bienvenido, {nombreUsuario}</span>

          <button onClick={() => setMenuAbierto(!menuAbierto)}
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
        {/* Sidebar permanente en pantallas grandes, o flotante en móviles */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed z-50 top-0 left-0 min-h-screen w-64 bg-gray-100 p-4 border-r shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none`}
        >
          <nav className="space-y-4 mt-16 lg:mt-0">
            {/* Grupo principal */}
            <div className="space-y-2">
              <SidebarButton label="Proyectos" icon={<FaFolderOpen />} active />
            </div>
      
            <hr className="my-4 border-gray-300" />
      
            {/* Grupo secundario */}
            <div className="space-y-2">
              <SidebarButton label="Configuración" icon={<FaWrench />} />
            </div>
          </nav>
        </aside>
      
        {/* Botón hamburguesa solo visible en pantallas pequeñas */}
        <button
          className="lg:hidden absolute top-4 left-2 z-50 text-white bg-blue-800 p-2 rounded-md shadow-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        

        {/* Sección principal */}
        <main className="flex-1 p-8 bg-gray-50">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Proyectos</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow border flex justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Fumigación Caribe</h2>
                  <p className="text-sm text-gray-500">6 de abril 2025</p>
                  <p className="mt-2 italic text-gray-700">
                    Reportes cargados: 6 <br />
                    Estado: En ejecución
                  </p>
                  <div className="mt-4 border rounded p-2 bg-gray-100 text-center text-gray-800">
                    <p className="text-xl font-bold">200+</p>
                    <p className="text-sm text-gray-500">Hectáreas Fumigadas</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center text-sm text-gray-800">
                    Gráfico
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
  