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
      const data = await getDocuments();
      setDocumentos(data);
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <button
          className="lg:hidden absolute top-4 left-2 z-50 text-white bg-blue-800 p-2 rounded-md shadow-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        <main className="flex-1 p-8 bg-gray-50">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Proyectos</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documentos.map((mesData, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow border flex justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{mesData.month}</h2>
                  <p className="mt-2 italic text-gray-700">
                    Reportes cargados: {mesData.reports} <br />
                    Estado: {mesData.status}
                  </p>
                  <div className="mt-4 border rounded p-2 bg-gray-100 text-center text-gray-800">
                    <p className="text-xl font-bold">{mesData.acres}+</p>
                    <p className="text-sm text-gray-500">Hectáreas Fumigadas</p>
                  </div>
                  <button
                    onClick={() => navigate(`/socio/mes/${encodeURIComponent(mesData.month)}`)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
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
