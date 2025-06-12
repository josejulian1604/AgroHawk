import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell } from "recharts";
import { FaMedal } from "react-icons/fa";
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

export default function AdminPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);

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

  if (proyectos)
  return (
    <AdminLayout current="Proyectos">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Proyectos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {proyectos.map((proyecto) => {
          const chartColors = [getColorByStatus(proyecto.status), "#eee"];

          return (
            <Link
              to={`/proyectos/${proyecto._id}`}
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
    </AdminLayout>
  );
}