import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE } from "../../config"; // Asegúrate de que esta ruta sea correcta

const ResetPassword = () => {
  const { id: token } = useParams(); 
  const navigate = useNavigate();

  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmacionPassword, setConfirmacionPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setMensaje("Token inválido o ausente.");
      return;
    }

    if (nuevaPassword !== confirmacionPassword) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/reset/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nuevaPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje("Contraseña actualizada correctamente.");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setMensaje(data.mensaje || "Error al actualizar la contraseña.");
      }
    } catch (err) {
      console.error("Error:", err);
      setMensaje("Ocurrió un error al intentar cambiar la contraseña.");
    }
  };

  return (
    <div className="text-gray-800 min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Nueva contraseña</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nueva contraseña"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
            <span
                className="absolute right-3 top-3 cursor-pointer text-gray-600 text-lg"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirmar contraseña"
              value={confirmacionPassword}
              onChange={(e) => setConfirmacionPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
            <span
                className="absolute right-3 top-3 cursor-pointer text-gray-600 text-lg"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Cambiar contraseña
          </button>
          {mensaje && <p className="text-center text-sm text-green-600">{mensaje}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
