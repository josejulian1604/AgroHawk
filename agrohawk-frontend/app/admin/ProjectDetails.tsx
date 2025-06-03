import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";

type Proyecto = {
  _id: string;
  nombre: string;
  cliente: string;
  ubicacion: string;
  fecha: string;
  status: string;
  cultivo?: string;
  hectareas?: number;
  producto?: string;
  boquillas?: string;
  volumenAplicado?: number;
  alturaAplicada?: number;
  piloto?: { nombre: string };
  dron?: { modelo: string };
  estadoActual?: string;
  reportePDF?: string;
};

export default function ProjectDetails() {
  const { id } = useParams(); 
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);

  useEffect(() => {
    const fetchProyecto = async () => {
      try {
        const res = await fetch(`/api/proyectos/${id}`);
        const data = await res.json();
        setProyecto(data);
      } catch (error) {
        console.error("Error al obtener proyecto:", error);
      }
    };

    fetchProyecto();
  }, [id]);

  if (!proyecto) return (<AdminLayout current="Proyectos">
    <p className="text-gray-800">Cargando...</p>
    </AdminLayout>
    );
  return (
    <AdminLayout current="Proyectos">
      <div className="text-gray-800">
        <h1 className="text-gray-800 text-2xl font-bold mb-4">Resumen del Proyecto</h1>

        <div className="bg-white rounded shadow p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2">{proyecto.nombre}</h2>
          <p><strong>Cliente:</strong> {proyecto.cliente}</p>
          <p><strong>Ubicación:</strong> {proyecto.ubicacion}</p>
          <p><strong>Fecha:</strong> {new Date(proyecto.fecha).toLocaleDateString("es-CR")}</p>
          <p><strong>Status:</strong> {proyecto.status}</p>
        </div>

        <div className="bg-white rounded shadow p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">Detalles Técnicos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><strong>Cultivo:</strong> {proyecto.cultivo || "-"}</div>
            <div><strong>Hectáreas:</strong> {proyecto.hectareas || "-"}</div>
            <div><strong>Producto:</strong> {proyecto.producto || "-"}</div>
            <div><strong>Boquillas:</strong> {proyecto.boquillas || "-"}</div>
            <div><strong>Volumen:</strong> {proyecto.volumenAplicado || "-"}</div>
            <div><strong>Altura:</strong> {proyecto.alturaAplicada || "-"}</div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <button className="bg-gray-500 text-white px-4 py-2 rounded">
            Previsualizar Reporte
          </button>
          <button className="bg-green-700 text-white px-4 py-2 rounded">
            Descargar Reporte
          </button>
        </div>

        <div className="bg-white p-4 rounded shadow mb-6">
          <p><strong>Estado Actual:</strong> {proyecto.estadoActual || "Pendiente de revisión"}</p>
        </div>
      </div>
    </AdminLayout>
  );
}
