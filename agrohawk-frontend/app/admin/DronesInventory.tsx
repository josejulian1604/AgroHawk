import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { FaPlus, FaRegEdit, FaTrashAlt } from "react-icons/fa";

type Dron = {
  _id: string;
  modelo: string;
  numeroSerie: string;
  placa: string;
  proyectoAsignado: string;
  estado: "disponible" | "ocupado" | "mantenimiento";
  observaciones?: string;
};

export default function DronesInventory() {
  const [dronAEliminar, setDronAEliminar] = useState<Dron | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [dronEditando, setDronEditando] = useState<Dron | null>(null);
  const [drones, setDrones] = useState<Dron[]>([]);
  const formularioInicial = {
    modelo: "",
    numeroSerie: "",
    placa: "",
    proyectoAsignado: "ninguno",
    estado: "disponible",
    observaciones: "",
  };
  const [formulario, setFormulario] = useState(formularioInicial);

  const confirmarEliminacion = async () => {
    if (!dronAEliminar) return;
    
    try {
      const response = await fetch(`/api/drones/${dronAEliminar._id}`, {
        method: "DELETE",
      });
    
      const data = await response.json();
      if (!response.ok) throw new Error(data.mensaje || "Error al eliminar");
    
      setDrones((prev) => prev.filter((a) => a._id !== dronAEliminar._id));
      setMostrarConfirmacion(false);
      setDronAEliminar(null);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error al eliminar");
    }
  };

  const handleEliminarDron = async (id: string) => {
    if (!window.confirm("¿Seguro que quieres eliminar este dron?")) return;

    try {
      const res = await fetch(`/api/drones/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");

      setDrones((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error("Error al eliminar dron:", err);
    }
  };

  const abrirModal = (dron?: Dron) => {
    if (dron) {
      setDronEditando(dron); 
      setFormulario({
        modelo: dron.modelo,
        numeroSerie: dron.numeroSerie,
        placa: dron.placa,
        proyectoAsignado: dron.proyectoAsignado,
        estado: dron.estado,
        observaciones: dron.observaciones || "",
      });
    } else {
      setDronEditando(null); 
      setFormulario(formularioInicial);
    }

    setMostrarModal(true);
  };

  useEffect(() => {
    const fetchDrones = async () => {
      try {
        const res = await fetch("/api/drones");
        const data = await res.json();
        setDrones(data);
      } catch (error) {
        console.error("Error al obtener drones:", error);
      }
    };

    fetchDrones();
  }, []);

  const getBadgeColor = (estado: string) => {
    switch (estado) {
      case "disponible":
        return "bg-green-200 text-green-800";
      case "ocupado":
        return "bg-red-300 text-red-800";
      case "mantenimiento":
        return "bg-yellow-300 text-yellow-900";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const handleGuardar = async () => {
    try {
      const metodo = dronEditando ? "PUT" : "POST";
      const url = dronEditando ? `/api/drones/${dronEditando._id}` : "/api/drones";

      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulario),
      });

      const actualizado = await res.json();

      if (dronEditando) {
        // Actualizar el dron en la lista
        setDrones((prev) =>
          prev.map((d) => (d._id === actualizado.dron._id ? actualizado.dron : d))
        );
      } else {
        // Agregar nuevo dron
        setDrones((prev) => [...prev, actualizado.dron]);
      }

      setMostrarModal(false);
      setFormulario(formularioInicial);
      setDronEditando(null);
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  };

  return (
  <AdminLayout current="Inventario">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Almacén de Drones</h1>
    <button className="bg-[#1F384C] w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-[#27478c]" 
    onClick={() => abrirModal()}
    >
      <FaPlus size={16} />
    </button>
    </div>
    
    <div className="space-y-6">
      {drones.map((dron) => (
        <div
          key={dron._id}
          className="bg-white p-6 rounded-lg shadow border text-gray-800 space-y-4"
        >
          {/* Título superior */}
          <div>
            <h2 className="text-xl font-semibold">{dron.placa}</h2>
          </div>

          {/* Fila con la info y botones */}
          <div className="flex flex-wrap items-center gap-6">
            {/* Columna 1 */}
            <div className="min-w-[180px]">
              <p><span className="font-bold">Placa:</span> {dron.placa}</p>
              <p><span className="font-bold">Modelo:</span> {dron.modelo}</p>
            </div>

            {/* Columna 2 */}
            <div className="min-w-[180px]">
              <p><span className="font-bold">Número de Serie:</span> {dron.numeroSerie}</p>
              <p><span className="font-bold">Proyecto Asignado:</span> {dron.proyectoAsignado || "Ninguno"}</p>
            </div>

            {/* Columna 3 */}
            <div className="min-w-[180px]">
              <p><span className="font-bold">Observaciones:</span> {dron.observaciones || "-"}</p>
              <p className="font-bold">
                Estado:{" "}
                <span className={`px-2 py-1 rounded ${getBadgeColor(dron.estado)}`}>
                  {dron.estado.charAt(0).toUpperCase() + dron.estado.slice(1)}
                </span>
              </p>
            </div>

            {/* Columna 4: Botones */}
            <div className="ml-auto flex flex-col gap-3">
              <button className="bg-[#1F384C] p-3 rounded-full text-white hover:bg-[#27478c]"
              onClick={() => abrirModal(dron)}
              >
                <FaRegEdit size={18} />
              </button>
              <button className="bg-[#1F384C] p-3 rounded-full text-white hover:bg-[#8b1c1c]"
              onClick={() => {
                  setDronAEliminar(dron);
                  setMostrarConfirmacion(true);
              }}
              >
                <FaTrashAlt size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
    {mostrarModal && (
      <div className="text-gray-800 fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">{dronEditando ? "Editar Dron" : "Agregar Dron"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["modelo", "numeroSerie", "placa"].map((campo) => (
              <input
                key={campo}
                type="text"
                name={campo}
                value={formulario[campo as keyof typeof formulario]}
                onChange={(e) =>
                  setFormulario({ ...formulario, [campo]: e.target.value })
                }
                placeholder={campo}
                className="border px-3 py-2 rounded"
              />
            ))}
            <input
              type="text"
              name="observaciones"
              placeholder="Observaciones"
              value={formulario.observaciones}
              onChange={(e) =>
                setFormulario({ ...formulario, observaciones: e.target.value })
              }
              className="border px-3 py-2 rounded md:col-span-2"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              className="bg-red-600 hover:bg-red-400 text-white px-4 py-2 rounded"
              onClick={() => setMostrarModal(false)}
            >
              Cancelar
            </button>
            <button
              className="bg-[#1F384C] hover:bg-[#27478c] text-white px-4 py-2 rounded"
              onClick={handleGuardar}
            >
              {dronEditando ? "Guardar Cambios" : "Agregar Dron"}
            </button>
          </div>
        </div>
      </div>
    )}
    {mostrarConfirmacion && dronAEliminar && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex justify-center items-center z-50 text-gray-800">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm text-center border border-gray-800">
            <h2 className="text-xl font-bold mb-2">¿Desea eliminar a este administrador?</h2>
            <p className="text-sm text-gray-600 mb-6">
              Se eliminará permanentemente el dron: <br />
              <strong>{dronAEliminar.placa}</strong>
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="border border-gray-500 px-4 py-2 rounded text-gray-700 hover:bg-gray-100"
                onClick={() => setMostrarConfirmacion(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-[#1F384C] text-white px-4 py-2 rounded hover:bg-[#27478c]"
                onClick={confirmarEliminacion}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
  </AdminLayout>
);



}
