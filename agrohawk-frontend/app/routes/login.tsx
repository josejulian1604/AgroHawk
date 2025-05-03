// Login file.
import React from "react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex">
      {/* Sección izquierda: imagen */}
      <div className="w-1/2 hidden lg:block">
        <img
          src="/dron.jpg"
          alt="Drone de fumigación"
          className="h-full w-full object-cover rounded-l-lg"
        />
      </div>

      {/* Sección derecha: formulario */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 py-12 bg-white">
        <div className="max-w-md w-full space-y-6">
          {/* Logo y título */}
          <div className="text-center">
            <img
              src="/logo.png"
              alt="AgroHawk"
              className="mx-auto h-20 w-auto"
            />
            <h2 className="mt-6 text-2xl font-bold text-gray-800">
              Bienvenido
            </h2>
          </div>

          {/* Formulario */}
          <form className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 mt-1 border rounded-md"
                placeholder="usuario@ejemplo.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2 mt-1 border rounded-md pr-10"
                  placeholder="********"
                />
                {/* Puedes agregar lógica para mostrar/ocultar */}
                <span className="absolute right-3 top-3 cursor-pointer">
                  👁️
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <label className="flex items-center space-x-2">
                <input type="checkbox" />
                <span className="text-sm text-gray-600">Recuérdame</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                ¿Olvidó su Contraseña?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="text-center text-xs text-gray-400 mt-8">
            © 2025 AgroHawk.
          </div>
        </div>
      </div>
    </div>
  );
}