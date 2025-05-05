// Login file.
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("User: ", correo);
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo, contraseña }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.mensaje || "Error al iniciar sesión");
      }
  
      const data = await response.json();
      localStorage.setItem("token", data.token); // Guardar el token
      navigate("/"); // Redirigir al home u otra ruta
    } catch (err: any) {
      setError(err.message);
    }
  };
  

  return (
    <div className="min-h-screen flex">
      {/* Left Section: Image */}
      <div className="w-2/3 hidden lg:block">
        <img
          src="/dron.jpg"
          alt="Drone de fumigación"
          className="h-full w-full object-cover rounded-l-lg"
        />
      </div>

      {/*  Right Section: Login Form */}
      <div className="w-full lg:w-1/3 flex flex-col justify-between px-8 py-8 bg-white rounded-r-2xl">
        <div className="flex flex-col gap-8">
          {/* Title */}
          <div className="text-center">
            <Link to="/">
              <img
                src="/logo.png"
                alt="AgroHawk"
                className="mx-auto h-20 object-contain"
              />
            </Link>
            <h2 className="mt-4 text-2xl font-bold text-gray-800">
              Bienvenido
            </h2>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
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
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full px-4 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md placeholder-gray-500 text-gray-800"
                placeholder="usuario@agrohawk.com"
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
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  className="w-full px-4 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md pr-10 placeholder-gray-500 text-gray-800"
                  placeholder="********"
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer text-gray-600 text-lg"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
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
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        </div>

        {/* Footer */}
        <hr className="my-6 border-gray-200" />
        <div className="text-center text-xs text-gray-400">
          <img
            src="/logo.png"
            alt="AgroHawk"
            className="mx-auto h-6 mb-1 object-contain"
          />
          © 2025 AgroHawk.
        </div>
        
      </div>
    </div>
  );
}