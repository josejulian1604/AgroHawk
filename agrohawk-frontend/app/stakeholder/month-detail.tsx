import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useParams } from "react-router";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function StakeholderMonthDetail() {
  const { month } = useParams<{ month: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Datos genéricos de ejemplo con nombre del documento
  const documentos = [
    { nombre: "Minuta 6 - Proyecto Caribe", tipo: "PDF", tipoDoc: "Minutas", titulo: "Minuta - Reunión Inicial", fecha: "7 de abril, 2025" },
    { nombre: "Presentación Avance - Proyecto Caribe", tipo: "PPT", tipoDoc: "Presentaciones", titulo: "Presentación Avance", fecha: "7 de abril, 2025" },
    { nombre: "Estado Financiero - Proyecto Caribe", tipo: "XLS", tipoDoc: "Estados Financieros", titulo: "Estado Financiero", fecha: "7 de abril, 2025" },
    { nombre: "Reporte Técnico Final - Proyecto Caribe", tipo: "DOC", tipoDoc: "Documentos", titulo: "Reporte Técnico Final", fecha: "7 de abril, 2025" },
  ];

  const [filtro, setFiltro] = useState("Resumen");

  const documentosFiltrados = filtro === "Resumen"
    ? documentos
    : documentos.filter((doc) => doc.tipoDoc === filtro);

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
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Detalles de {decodeURIComponent(month || "")}
          </h1>

          {/* Tabla de documentos */}
          <div className="bg-white rounded shadow border">
            <div className="flex space-x-4 border-b overflow-x-auto">
              {["Resumen", "Minutas", "Presentaciones", "Estados Financieros", "Documentos"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFiltro(tab)}
                  className={`py-2 px-4 font-medium ${
                    filtro === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-4">
              {documentosFiltrados.length > 0 ? (
                documentosFiltrados.map((doc, i) => (
                  <div
                    key={i}
                    className="flex flex-col md:flex-row md:items-center justify-between border rounded p-2 shadow-sm bg-white mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`px-2 py-1 rounded text-xs font-bold text-white ${
                          doc.tipo === "PDF"
                            ? "bg-red-500"
                            : doc.tipo === "PPT"
                            ? "bg-orange-400"
                            : doc.tipo === "XLS"
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }`}
                      >
                        {doc.tipo}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">{doc.titulo}</h3>
                        <p className="text-xs text-gray-500">{doc.fecha}</p>
                        <p className="text-xs text-gray-700 font-semibold">{doc.nombre}</p>
                      </div>
                    </div>
                    <button className="mt-2 md:mt-0 p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition">
                      <svg
                        className="h-4 w-4 text-gray-700"
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
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No hay documentos disponibles para este filtro.</p>
              )}
            </div>
          </div>

          <div className="mt-8 bg-white p-4 rounded shadow border">
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
