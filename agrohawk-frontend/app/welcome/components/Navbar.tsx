import { useState } from "react";
import { UserCircle } from "lucide-react";
import { Link } from "react-router-dom"; // solo si usas React Router

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#102736] text-white px-6 py-4 flex items-center justify-between shadow relative">
      {/* Logo */}
      <div className="flex-shrink-0">
        <img src="/logoUI.png" alt="AgroHawk" className="h-10 md:h-12" />
      </div>

      {/* Menú central */}
      <nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex space-x-8 text-sm">
        <a href="#inicio" className="hover:text-teal-400">Inicio</a>
        <a href="#acerca" className="hover:text-teal-400">Acerca de</a>
        <a href="#contacto" className="hover:text-teal-400">Contáctanos</a>
      </nav>

      {/* Ícono y menú */}
      <div className="relative">
        <div
          className="cursor-pointer hover:text-teal-400"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <UserCircle size={28} />
        </div>

        {menuOpen && (
          <div className="absolute right-0 mt-2 bg-white text-black rounded-md shadow-md w-40 z-50">
            <Link
              to="/login"
              className="block px-4 py-2 hover:bg-gray-100 text-sm"
              onClick={() => setMenuOpen(false)}
            >
              Iniciar sesión
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}