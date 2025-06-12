import GerenteLayout from "../../components/GerenteLayout";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell } from "recharts";
import { FaMedal, FaPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE } from "../../config";

type Proyecto = {
  _id: string;
  nombre: string;
  fecha: string;
  status: string;
  hectareas?: number;
  cultivo?: string;
  imagenesBoletas?: string[];
  imagenRecorrido?: string;
};

 const getColorByStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "pendiente":
        return "#f59e0b"; 
      case "en revisión":
        return "#3b82f6"; 
      case "completado":
        return "#10b981"; 
      default:
        return "#9ca3af"; 
    }
  };

export default function ManagerPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const abrirModal = () => setMostrarModal(true);
  const cerrarModal = () => setMostrarModal(false);

  interface NuevoProyecto {
    nombre: string;
    cliente: string;
    ubicacion: string;
    fecha: string;
    piloto: string;
    dron: string;
  }

  const [nuevoProyecto, setNuevoProyecto] = useState<NuevoProyecto>({
    nombre: "",
    cliente: "",
    ubicacion: "",
    fecha: "",
    piloto: "",
    dron: "",
  });
  
  const [pilotos, setPilotos] = useState<any[]>([]);
  const [drones, setDrones] = useState<any[]>([]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNuevoProyecto({ ...nuevoProyecto, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/proyectos`);
        const data = await res.json();
        setProyectos(data);
      } catch (err) {
        console.error("Error al obtener proyectos:", err);
      }
    };

    fetchProyectos();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const resPilotos = await fetch(`${API_BASE}/api/pilotos`);
      const resDrones = await fetch(`${API_BASE}/api/drones`);
      const pilotosData = await resPilotos.json();
      const dronesData = await resDrones.json();
  
      setPilotos(pilotosData);
      setDrones(dronesData);
    };
  
    fetchData();
  }, []);

  const handleCrearProyecto = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
    const decoded = token ? JSON.parse(atob(token.split(".")[1])) : null;
    const creadoPor = decoded?.id;
  
    try {
      const res = await fetch(`${API_BASE}/api/proyectos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...nuevoProyecto, creadoPor }),
      });
  
      if (!res.ok) throw new Error("Error al crear proyecto");

      const data = await res.json();
  
      toast.success("Guardado con éxito", {
        position: "bottom-right",
        autoClose: 3000, 
      });
      cerrarModal();
      setProyectos((prev) => [...prev, data.proyecto]);
    } catch (err) {
      console.error("Error al crear proyecto:", err);
      toast.error("No se pudo crear el proyecto.");
    }
  };

  return (
    <GerenteLayout current="Proyectos">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Proyectos</h1>
        <button className="bg-[#1F384C] w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-[#27478c]" 
        onClick={() => abrirModal()}
        >
          <FaPlus size={16} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {proyectos.map((proyecto) => {
          const chartColors = [getColorByStatus(proyecto.status), "#eee"];

          return (
            <Link
              to={`/proyecto-gerente/${proyecto._id}`}
              key={proyecto._id}
              className="block hover:shadow-md transition"
            >
              <div className="bg-white p-4 rounded-lg shadow border flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{proyecto.nombre}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(proyecto.fecha).toLocaleDateString("es-CR", {
                      timeZone: "UTC",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="mt-2 italic text-gray-700">Estado: {proyecto.status}</p>
                  <p className="text text-gray-600 mt-2">
                    Documentos Cargados: {(proyecto.imagenesBoletas?.length || 0) + (proyecto.imagenRecorrido ? 1 : 0)}
                  </p>
                  
                  {proyecto.hectareas && (
                    <div className="mt-4 flex items-center gap-2 border rounded p-2 bg-gray-100 text-gray-800">
                      <p className="text-xl font-bold">{proyecto.hectareas}+</p>
                      <p className="text-sm text-gray-600">Hectáreas Fumigadas</p>
                      <FaMedal className="text-yellow-600 text-lg" />
                    </div>
                  )}
                </div>
                
                <div className="w-40 h-40 flex flex-col items-center justify-center bg-gray-50 rounded-lg shadow-inner p-3">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Cultivo Tratado</h4>
                  <PieChart width={120} height={120}>
                    <Pie
                      data={[{ name: "Tratado", value: 100 }, { name: "Restante", value: 0 }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={50}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {chartColors.map((color, i) => (
                        <Cell key={`cell-${i}`} fill={color} />
                      ))}
                    </Pie>
                  </PieChart>
                  <p className="text-xs mt-1 text-gray-500">{proyecto.cultivo} 100%</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center z-50 text-gray-800">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl shadow-lg relative border border-gray-800">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              onClick={cerrarModal}
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4">Agregar Nuevo Proyecto</h3>
          
            <form
              onSubmit={handleCrearProyecto}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {[
                { label: "Nombre", name: "nombre" },
                { label: "Cliente", name: "cliente" },
                { label: "Ubicación", name: "ubicacion" },
              ].map(({ label, name }) => (
                <div key={name}>
                  <label className="text-sm font-medium">{label}</label>
                  <input
                    name={name}
                    type="text"
                    value={nuevoProyecto[name as keyof NuevoProyecto]}
                    onChange={handleInputChange}
                    className="border px-3 py-2 rounded w-full"
                    required
                  />
                </div>
              ))}
      
              <div>
                <label className="text-sm font-medium">Fecha</label>
                <input
                  name="fecha"
                  type="date"
                  value={nuevoProyecto.fecha}
                  onChange={handleInputChange}
                  className="border px-3 py-2 rounded w-full"
                  required
                />
              </div>
          
              <div>
                <label className="text-sm font-medium">Piloto</label>
                <select
                  name="piloto"
                  value={nuevoProyecto.piloto}
                  onChange={handleInputChange}
                  className="border px-3 py-2 rounded w-full"
                  required
                >
                  <option value="">Seleccione un piloto</option>
                  {pilotos.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Dron</label>
                <select
                  name="dron"
                  value={nuevoProyecto.dron}
                  onChange={handleInputChange}
                  className="border px-3 py-2 rounded w-full"
                  required
                >
                  <option value="">Seleccione un dron</option>
                  {drones.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.modelo}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded"
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#1F384C] hover:bg-[#27478c] text-white px-4 py-2 rounded"
                >
                  Crear Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </GerenteLayout>
  );
}
