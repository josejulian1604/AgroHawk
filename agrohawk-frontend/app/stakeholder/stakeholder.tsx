import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaBars, FaTimes } from "react-icons/fa";
import { getDocuments } from "../../services/documentService";
import type { MonthDocument } from "../../services/documentService";

export default function Stakeholder() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [documentos, setDocumentos] = useState<MonthDocument[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getDocuments();
        setDocumentos(data);
      } catch (error) {
        console.error("Error al obtener documentos por mes:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar open={sidebarOpen} />

        {/* Botón hamburguesa para móviles */}
        <button
          className="lg:hidden absolute top-4 left-2 z-50 text-white bg-blue-800 p-2 rounded-md shadow-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* Contenido principal */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 overflow-y-auto">
          <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">Proyectos</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {documentos.map((mesData, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow border flex flex-col justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{mesData.month}</h2>
                  <p className="mt-2 text-sm italic text-gray-700">
                    Reportes cargados: {mesData.reports}
                  </p>
                  <button
                    onClick={() => navigate(`/socio/mes/${encodeURIComponent(mesData.month)}`)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
