import { UserCircle } from "lucide-react";

export default function Navbar() {
  return (
    <header className="bg-[#102736] text-white px-6 py-4 flex items-center justify-between shadow relative">
      {/* Logo a la izquierda */}
      <div className="flex-shrink-0">
        <img src="/logoUI.png" alt="AgroHawk" className="h-10 md:h-12" />
      </div>

      {/* Menú centrado absolutamente */}
      <nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex space-x-8 text-sm">
        <a href="#inicio" className="hover:text-teal-400">Inicio</a>
        <a href="#acerca" className="hover:text-teal-400">Acerca de</a>
        <a href="#contacto" className="hover:text-teal-400">Contáctanos</a>
      </nav>

      {/* Icono de usuario a la derecha */}
      <div className="cursor-pointer hover:text-teal-400">
        <UserCircle size={28} />
      </div>
    </header>
  );
}
