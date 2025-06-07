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

  useEffect(() => {
    if (tipo) {
      fetch(`/api/documentos/tipo/${tipo}`)
        .then(res => res.json())
        .then(data => {
          setDocumentos(data);
          setLoading(false);
        });
    }
  }, [tipo]);

  const handleBuscar = () => {
    if (!busqueda) return;

    fetch(`/api/documentos/buscar?q=${busqueda}`)
      .then(res => res.json())
      .then(data => setDocumentos(data));
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
        <button onClick={handleBuscar} className="bg-blue-600 text-white px-4 py-2 rounded">
          Buscar
        </button>
      </div>

      {loading ? (
        <p className="text-gray-800">Cargando documentos...</p>
      ) : documentos.length === 0 ? (
        <p className="text-gray-800">No hay documentos disponibles.</p>
      ) : (
        <ul className="space-y-4 text-gray-800">
          {documentos.map((doc) => (
            <li key={doc._id} className="bg-white shadow p-4 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-semibold">{doc.titulo}</h2>
                  <p className="text-sm text-gray-500">
                    Subido: {new Date(doc.fechaSubida).toLocaleDateString()}
                  </p>
                </div>
                <a
                  href={doc.archivoURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Ver archivo
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminLayout>
  );
}
