import React from "react";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    modelo: string;
    numeroSerie: string;
    placa: string;
    estado: string;
    observaciones: string;
    proyectoAsignado: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  modoEdicion: boolean;
};

export default function DronModal({
  visible,
  onClose,
  onSubmit,
  formData,
  onChange,
  modoEdicion,
}: Props) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">{modoEdicion ? "Editar Dron" : "Agregar Dron"}</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {["modelo", "numeroSerie", "placa", "observaciones", "proyectoAsignado"].map((field) => (
            <input
              key={field}
              name={field}
              type="text"
              value={formData[field as keyof typeof formData]}
              onChange={onChange}
              placeholder={field[0].toUpperCase() + field.slice(1)}
              className="w-full border rounded px-3 py-2"
              required={field !== "observaciones" && field !== "proyectoAsignado"}
            />
          ))}

          <select
            name="estado"
            value={formData.estado}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Seleccionar Estado</option>
            <option value="disponible">Disponible</option>
            <option value="ocupado">Ocupado</option>
            <option value="mantenimiento">Mantenimiento</option>
          </select>

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
              {modoEdicion ? "Guardar Cambios" : "Agregar Dron"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}