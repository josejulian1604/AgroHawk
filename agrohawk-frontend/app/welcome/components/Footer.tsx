import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white px-6 py-12">
      {/* Parte superior */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 border-b border-gray-700 pb-8">
        {/* Logo y descripción */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <img src="/logoUI.png" alt="AgroHawk Logo" className="h-10" />
            <span className="font-bold text-lg">AgroHawk</span>
          </div>
          <p className="text-sm text-gray-300">
            Soluciones aéreas para la agricultura moderna en Costa Rica.
            Mejoramos la productividad de tus cultivos con tecnología de drones.
          </p>
        </div>

        {/* Enlaces de navegación */}
        <div>
          <h4 className="font-semibold text-white mb-3">Páginas</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#inicio" className="hover:text-teal-400">Inicio</a></li>
            <li><a href="#acerca" className="hover:text-teal-400">Acerca de</a></li>
            <li><a href="#servicios" className="hover:text-teal-400">Servicios</a></li>
            <li><a href="#contacto" className="hover:text-teal-400">Contáctanos</a></li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div>
          <h4 className="font-semibold text-white mb-3">Síguenos</h4>
          <p className="text-sm text-gray-300 mb-4">Encuentra novedades y actualizaciones en nuestras redes:</p>
          <a
            href="https://www.instagram.com/agrohawk" // actualiza con el enlace real si tienes uno
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-full hover:bg-gray-100 transition"
          >
            <Instagram size={20} />
            <span>Instagram</span>
          </a>
        </div>
      </div>

      {/* Parte inferior */}
      <div className="max-w-7xl mx-auto pt-6 grid grid-cols-1 md:grid-cols-3 text-sm text-gray-400 gap-6">
        <div className="text-center md:text-left">
          <p className="font-semibold text-white">© 2025 AgroHawk. Todos los derechos reservados.</p>
        </div>
        <div className="text-center">
          <p className="font-semibold text-white">Contáctanos</p>
          <p>+506 1234-5678</p>
          <p>info@agrohawk.com</p>
        </div>
        <div className="text-center md:text-right">
          <p className="font-semibold text-white">Dirección</p>
          <p>Costa Rica, Servicio a todo el país.</p>
        </div>
      </div>
    </footer>
  );
}
