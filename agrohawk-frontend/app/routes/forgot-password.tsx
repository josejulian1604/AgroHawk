import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { API_BASE } from "../../config"; // Asegúrate de que esta ruta sea correcta

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = Date.now().toString(36); // Puedes cambiar esto por un token real si lo generas en el backend

      const res = await fetch(`${API_BASE}/api/reset/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje("Se enviaron las instrucciones al correo.");
        setError(null);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(data.mensaje || "Error al enviar correo.");
        setMensaje(null);
      }
    } catch (err) {
      console.error(err);
      setError("Error al contactar al servidor.");
      setMensaje(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Restablecer contraseña
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Ingresa tu correo electrónico y te enviaremos instrucciones para
          restablecer tu contraseña.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              placeholder="usuario@agrohawk.com"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-semibold"
          >
            Enviar instrucciones
          </button>
          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">
              ¿Recordaste tu contraseña?{" "}
            </span>
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Volver al Inicio de Sesión
            </Link>
          </div>

          {mensaje && (
            <p className="text-green-600 text-sm text-center mt-2">{mensaje}</p>
          )}
          {error && (
            <p className="text-red-600 text-sm text-center mt-2">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
