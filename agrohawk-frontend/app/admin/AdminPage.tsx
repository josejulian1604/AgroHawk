import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { Link } from "react-router-dom";

type Proyecto = {
  _id: string;
  nombre: string;
  fecha: string;
  status: string;
  hectareas?: number;
  cultivo?: string;
};

export default function AdminPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const res = await fetch("/api/proyectos");
        const data = await res.json();
        setProyectos(data);
      } catch (err) {
        console.error("Error al obtener proyectos:", err);
      }
    };

    fetchProyectos();
  }, []);

  return (
    <AdminLayout current="Proyectos">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Proyectos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {proyectos.map((proyecto) => (
          <Link
            to={`/proyectos/${proyecto._id}`}
            key={proyecto._id}
            className="block hover:shadow-md transition"
          >
            <div className="bg-white p-4 rounded-lg shadow border flex justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{proyecto.nombre}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(proyecto.fecha).toLocaleDateString("es-CR", {
                    timeZone: 'UTC',
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="mt-2 italic text-gray-700">
                  Estado: {proyecto.status}
                </p>
                {proyecto.hectareas && (
                  <div className="mt-4 border rounded p-2 bg-gray-100 text-center text-gray-800">
                    <p className="text-xl font-bold">{proyecto.hectareas}+</p>
                    <p className="text-sm text-gray-500">Hectáreas Fumigadas</p>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center text-sm text-gray-800">
                  {proyecto.cultivo ? proyecto.cultivo : "Gráfico"}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}