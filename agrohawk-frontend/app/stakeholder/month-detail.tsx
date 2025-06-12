import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { getDocumentsByMonth } from "services/documentService";
import type { Document } from "services/documentService";


export default function StakeholderMonthDetail() {
  const { month } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [documentos, setDocumentos] = useState<Document[]>([]);
  const [filtro, setFiltro] = useState("Resumen");

  useEffect(() => {
    async function fetchDocs() {
      try {
        const data = await getDocumentsByMonth(month || "");
        setDocumentos(data);
      } catch (error) {
        console.error("Error al obtener documentos por mes: ", error);
      }
    }

    fetchDocs();
  }, [month]);

  const obtenerExtension = (url: string) => {
    const parts = url.split(".");
    return parts[parts.length - 1].toLowerCase();
  };

  const extensionToTipo = (ext: string) => {
    if (ext === "pdf") return "PDF";
    if (["xls", "xlsx"].includes(ext)) return "XLS";
    if (["ppt", "pptx"].includes(ext)) return "PPT";
    if (["doc", "docx"].includes(ext)) return "DOC";
    return "OTRO";
  };

  const extensionToTipoDoc = (tipo: string) => {
    if (tipo.includes("minuta")) return "Minutas";
    if (tipo.includes("presentacion")) return "Presentaciones";
    if (tipo.includes("estado")) return "Estados Financieros";
    return "Documentos";
  };

  const documentosFiltrados = filtro === "Resumen"
    ? documentos
    : documentos.filter((doc) => extensionToTipoDoc(doc.tipo.toLocaleLowerCase()) === filtro);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar open={sidebarOpen} />
        <button
          className="lg:hidden absolute top-4 left-2 z-50 text-white bg-blue-800 p-2 rounded-md shadow-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 mx-auto w-full">
          <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">
            Detalles de {decodeURIComponent(month || "")}
          </h1>

          {/* Tabla de documentos */}
          <div className="bg-white rounded shadow border">
            {/* Tabs */}
            <div className="flex space-x-4 border-b overflow-x-auto text-sm sm:text-base">
              {["Resumen", "Minutas", "Presentaciones", "Estados Financieros", "Documentos"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFiltro(tab)}
                  className={`whitespace-nowrap py-2 px-4 font-medium ${filtro === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Contenido de documentos filtrados */}
            <div className="p-4">
              {documentosFiltrados.length > 0 ? (
                documentosFiltrados.map((doc, i) => {
                  const ext = obtenerExtension(doc.archivoURL);
                  const tipo = extensionToTipo(ext);

                  return (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border rounded p-3 shadow-sm bg-white mb-3"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <div
                          className={`px-2 py-1 rounded text-xs font-bold text-white ${tipo === "PDF" ? "bg-red-600" :
                              tipo === "XLS" ? "bg-green-600" :
                                tipo === "PPT" ? "bg-blue-600" :
                                  tipo === "DOC" ? "bg-yellow-600" :
                                    "bg-gray-600"
                            }`}
                        >
                          {tipo}
                        </div>
                        <div className="flex flex-col text-sm">
                          <h3 className="font-medium text-gray-800">{doc.titulo}</h3>
                          <span className="text-xs text-gray-500">
                            {new Date(doc.fechaSubida).toLocaleDateString("es-CR")}
                          </span>
                        </div>
                      </div>

                      { /* Boton de descarga */}
                      <a
                        href={doc.archivoURL}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="self-start sm:self-auto p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
                      >
                        <svg
                          className="h-5 w-5 text-gray-700"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 4v16h16V4H4zm4 8h8m-4 4v-4m0 0V8m0 4H8m4 0h4"
                          />
                        </svg>
                      </a>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center text-sm">No hay documentos disponibles para este filtro</p>
              )}
            </div>
          </div>

          {/* Detalles del mes */}
          <div className="mt-8 bg-white p-4 rounded shadow border text-sm sm:text-base">
            <h2 className="text-xl font-bold mb-2 text-gray-800">
              Detalles del mes: {decodeURIComponent(month || "")}
            </h2>
            <p className="text-gray-600">
              Aquí se mostrarán todos los reportes, minutas, presentaciones y estados financieros al mes de{" "}
              {decodeURIComponent(month || "")}.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
