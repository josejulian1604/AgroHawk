import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";

interface Documento {
  _id: string;
  titulo: string;
  tipo: string;
  archivoURL: string;
  fechaSubida: string;
}

export default function DocumentosPorTipo() {
  const { tipo } = useParams();
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [docAEliminar, setDocAEliminar] = useState<Documento | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  // Cargar documentos al montar o al cambiar de tipo
  useEffect(() => {
    console.log("Tipo Recibido: ", tipo);
    if (!tipo) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/documentos/tipo/${tipo}`);
        const data = await res.json();
        setDocumentos(data);
      } catch (error) {
        console.error("Error al obtener documentos:", error);
        setDocumentos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tipo]);

  // Filtrar documentos localmente por nombre o fecha
  const documentosFiltrados = documentos.filter((doc) =>
    doc.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    doc.fechaSubida.includes(busqueda)
  );

    const confirmarEliminacion = async () => {
      if (!docAEliminar) return;
      
      try {
        const response = await fetch(`/api/documentos/${docAEliminar._id}`, {
          method: "DELETE",
        });
      
        const data = await response.json();
        if (!response.ok) throw new Error(data.mensaje || "Error al eliminar");
      
        setDocumentos((prev) => prev.filter((a) => a._id !== docAEliminar._id));
        setMostrarConfirmacion(false);
        setDocAEliminar(null);
      } catch (error: any) {
        console.error(error);
        alert(error.message || "Error al eliminar");
      }
    };

  return (
    <AdminLayout current="Documentos">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 capitalize">
        Documentos: {tipo?.replace("-", " ")}
      </h1>

      <div className="flex gap-2 mb-6 text-gray-800">
        <input
          type="text"
          placeholder="Buscar por nombre o fecha (YYYY-MM-DD)"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      {loading ? (
        <p className="text-gray-800">Cargando documentos...</p>
      ) : documentosFiltrados.length === 0 ? (
        <p className="text-gray-800">No hay documentos que coincidan con la búsqueda.</p>
      ) : (
        <ul className="space-y-4 text-gray-800">
          {documentosFiltrados.map((doc) => (
            <li key={doc._id} className="bg-white shadow p-4 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-semibold">{doc.titulo}</h2>
                  <p className="text-sm text-gray-500">
                    Subido el {new Date(doc.fechaSubida).toLocaleDateString("es-CR")}
                  </p>
                </div>
                <div className="flex gap-4">
                  <a
                    href={doc.archivoURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Descargar archivo
                  </a>
                  <button
                    onClick={async () => {
                      setDocAEliminar(doc);
                      setMostrarConfirmacion(true);
                    }}
                    className="text-red-600 underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {mostrarConfirmacion && docAEliminar && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex justify-center items-center z-50 text-gray-800">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm text-center border border-gray-800">
            <h2 className="text-xl font-bold mb-2">¿Desea eliminar este Documento?</h2>
            <p className="text-sm text-gray-600 mb-6">
              Se eliminará permanentemente el documento: <br />
              <strong>{docAEliminar.titulo}</strong>
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
