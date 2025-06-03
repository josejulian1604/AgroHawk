import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { FaArrowCircleLeft } from "react-icons/fa";

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
  comentarios?: string[];
  creadoPor?: { nombre: string; apellido1?: string };
  imagenesBoletas?: string[];
};

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [editando, setEditando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [formData, setFormData] = useState({
    cultivo: "",
    hectareas: "",
    producto: "",
    boquillas: "",
    alturaAplicada: "",
    volumenAplicado: ""
  });
  
  useEffect(() => {
    if (proyecto) {
      setFormData({
        cultivo: proyecto.cultivo || "",
        hectareas: proyecto.hectareas?.toString() || "",
        producto: proyecto.producto || "",
        boquillas: proyecto.boquillas || "",
        alturaAplicada: proyecto.alturaAplicada?.toString() || "",
        volumenAplicado: proyecto.volumenAplicado?.toString() || ""
      });
    }
  }, [proyecto]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGuardarCambios = async () => {
    try {
      const res = await fetch(`/api/proyectos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Error al guardar");

      const actualizado = await res.json();
      setProyecto(actualizado);
      setEditando(false);
    } catch (err) {
      console.error("Error al actualizar:", err);
    }
  };

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

  if (!proyecto) {
    return (
      <AdminLayout current="Proyectos">
        <p className="text-gray-800">Cargando proyecto...</p>
      </AdminLayout>
    );
  }
  return (
    <AdminLayout current="Proyectos">
      <div className="text-gray-800 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Resumen del Proyecto</h1>
          <button className="bg-[#1F384C] w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-[#27478c]"
          onClick={() => navigate("/admin")} 
        >
          <FaArrowCircleLeft size={16} />
        </button>
        </div>  

        {/* Tarjeta principal del proyecto */}
        <div className="bg-white rounded shadow p-4 gap-6">
          <h2 className="text-xl font-semibold mb-2">{proyecto.nombre}</h2>
          spacer
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <p><strong>Cliente:</strong> {proyecto.cliente}</p>
            <p><strong>Ubicación:</strong> {proyecto.ubicacion}</p>
            <p><strong>Fecha:</strong> {new Date(proyecto.fecha).toLocaleDateString("es-CR")}</p>
            <p><strong>Status:</strong> {proyecto.status}</p>
          </div>
        </div>

        {/* Detalles Técnicos */}
        <div className="bg-white rounded shadow p-4">
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

        {/* Formulario de edición */}
        {editando && (
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Editar Detalles Técnicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["cultivo", "producto", "boquillas"].map((campo) => (
                <input
                  key={campo}
                  type="text"
                  name={campo}
                  value={formData[campo as keyof typeof formData]}
                  onChange={handleInputChange}
                  placeholder={campo[0].toUpperCase() + campo.slice(1)}
                  className="border px-3 py-2 rounded"
                />
              ))}
              {["hectareas", "volumenAplicado", "alturaAplicada"].map((campo) => (
                <input
                  key={campo}
                  type="number"
                  name={campo}
                  value={formData[campo as keyof typeof formData]}
                  onChange={handleInputChange}
                  placeholder={campo[0].toUpperCase() + campo.slice(1)}
                  className="border px-3 py-2 rounded"
                />
              ))}
            </div>
            <div className="mt-4 flex gap-4 justify-end">
              <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded" onClick={() => setEditando(false)}>
                Cancelar
              </button>
              <button className="bg-[#1F384C] hover:bg-[#27478c] text-white px-4 py-2 rounded" onClick={handleGuardarCambios}>
                Guardar Cambios
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tarjeta de Reportes */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Reportes</h3>
            <div className="flex flex-col gap-4">
              <button className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded w-fit self-start">
                Previsualizar Reporte
              </button>
              <button className="bg-green-800 hover:bg-green-600 text-white px-4 py-2 rounded w-fit self-start">
                Descargar Reporte
              </button>
            </div>
          </div>

          {/* Tarjeta de Revisión */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Revisión</h3>
            <p><strong>Estado Actual:</strong> {proyecto.estadoActual || "Pendiente de revisión"}</p>
          </div>

          <div className="flex items-center justify-center">
            <button
              className="bg-[#1F384C] hover:bg-[#27478c] text-white px-4 py-2 rounded"
              onClick={() => setMostrarModal(true)}
            >
              Editar Proyecto
            </button>
          </div>

        </div>


        {/* Sección de Comentarios */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold text-lg mb-2">Comentarios</h3>
          {(proyecto.comentarios ?? []).length === 0 ? (
            <p className="text-gray-500 italic">No hay comentarios aún.</p>
          ) : (
            (proyecto.comentarios ?? []).map((comentario, i) => (
              <p key={i} className="mb-1">{comentario}</p>
            ))
          )}
          <p className="mt-4 text-sm text-gray-600">
            <strong>Proyecto Creado Por:</strong> {proyecto.creadoPor?.nombre || "-"} {proyecto.creadoPor?.apellido1 || ""}
          </p>
        </div>
      </div>
      {mostrarModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 text-gray-800">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-lg relative border border-gray-800">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              onClick={() => setMostrarModal(false)}
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4">Editar Detalles Técnicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {["cultivo", "producto", "boquillas"].map((campo) => (
                <input
                  key={campo}
                  type="text"
                  name={campo}
                  value={formData[campo as keyof typeof formData]}
                  onChange={handleInputChange}
                  placeholder={campo[0].toUpperCase() + campo.slice(1)}
                  className="border px-3 py-2 rounded"
                />
              ))}
              {["hectareas", "volumen Aplicado", "altura Aplicada"].map((campo) => (
                <input
                  key={campo}
                  type="number"
                  name={campo}
                  value={formData[campo as keyof typeof formData]}
                  onChange={handleInputChange}
                  placeholder={campo[0].toUpperCase() + campo.slice(1)}
                  className="border px-3 py-2 rounded"
                />
              ))}
            </div>
            
            <div className="mb-4">
              <h4 className="text-md font-medium mb-2">Boletas Asociadas</h4>
              {proyecto.imagenesBoletas?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {proyecto.imagenesBoletas.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Boleta ${i + 1}`}
                      className="w-full h-auto rounded border"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">Aún no se han agregado boletas al proyecto.</p>
              )}
            </div>
            
            <div className="flex justify-end gap-4">
              <button
                className="bg-red-700 hover:bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setMostrarModal(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-[#1F384C] hover:bg-[#27478c] text-white px-4 py-2 rounded"
                onClick={handleGuardarCambios}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
