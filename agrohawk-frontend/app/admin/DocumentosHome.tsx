import AdminLayout from "../../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const categorias = [
  {
    nombre: "Reportes Operativos",
    descripcion: "Boletas, mapas de recorrido y reportes PDF generados por proyectos.",
    tipo: "reporte-operativo",
  },
  {
    nombre: "Minutas",
    descripcion: "Documentos de reunión subidos por el equipo.",
    tipo: "minutas",
  },
  {
    nombre: "Estados Financieros",
    descripcion: "Archivos relacionados con la contabilidad o presupuesto.",
    tipo: "estado-financiero",
  },
  {
    nombre: "Presentaciones",
    descripcion: "Material visual de exposiciones o entregas.",
    tipo: "presentaciones",
  },
];

export default function DocumentosHome() {
  const navigate = useNavigate();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [proyectoId, setProyectoId] = useState("");
  const [proyectos, setProyectos] = useState<{ _id: string; nombre: string }[]>([]);
  
 useEffect(() => {
   fetch("/api/proyectos") 
     .then(res => res.json())
     .then(data => setProyectos(data))
     .catch(() => setProyectos([]));
 }, []);

  return (
    <AdminLayout current="Documentos">
       <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Documentos</h1>
            <button
              onClick={() => setMostrarModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              + Agregar Documento
            </button>
       </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categorias.map((categoria) => (
          <div
            key={categoria.tipo}
            className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition"
            onClick={() => navigate(`/documentos/${categoria.tipo}`)}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{categoria.nombre}</h2>
            <p className="text-gray-600">{categoria.descripcion}</p>
          </div>
        ))}
      </div>
      {mostrarModal && (
        <div className="text-gray-800 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setMostrarModal(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">Agregar nuevo documento</h2>
          
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Título del documento"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
      
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Selecciona el tipo</option>
                <option value="minuta">Minuta</option>
                <option value="estado financiero">Estado financiero</option>
                <option value="presentación">Presentación</option>
                <option value="reporte operativo">Reporte operativo</option>
              </select>
          
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg"
                onChange={(e) => setArchivo(e.target.files?.[0] || null)}
                className="w-full"
              />
      
              <select
                value={proyectoId}
                onChange={(e) => setProyectoId(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">(Opcional) Relacionado a proyecto</option>
                {proyectos.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
              
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                // En el próximo paso agregamos onClick
              >
                Subir documento
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
