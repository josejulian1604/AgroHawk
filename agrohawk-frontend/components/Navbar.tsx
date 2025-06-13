import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

type DecodedToken = {
  nombre: string;
  rol: string;
};

export default function Navbar() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [rolUsuario, setRolUsuario] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      setNombreUsuario(decoded.nombre);
      setRolUsuario(decoded.rol);
    }
  }, []);

  const traducirRol = (rol: string) => {
    switch (rol) {
      case "admin": return "Administrador";
      case "gerente": return "Gerente Operativo";
      case "piloto": return "Piloto";
      case "socio": return "Socio";
      default: return rol.charAt(0).toUpperCase() + rol.slice(1);
    }
  };

  return (
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
  );
}
