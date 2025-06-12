import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { FaArrowCircleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Proyecto {
  _id: string;
  nombre: string;
  imagenesBoletas: string[];
  imagenRecorrido?: string;
  reportePDF?: string;
  fecha: string;
  creadoEn: string;
}

export default function DocumentosOperativos() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/proyectos/reportes-operativos")
      .then((res) => res.json())
      .then((data) => {
        setProyectos(data);
        setLoading(false);
      });
  }, []);

  const filtrarProyectos = () => {
    if (!busqueda.trim()) return proyectos;

    const termino = busqueda.toLowerCase();
    return proyectos.filter((p) =>
      p.nombre.toLowerCase().includes(termino) ||
      new Date(p.fecha).toLocaleDateString("es-CR",{
        timeZone: "UTC",
        day: "numeric",
        month: "numeric",
        year: "numeric"
      }).toLowerCase().includes(termino) ||
      new Date(p.creadoEn).toLocaleDateString("es-CR",{
        timeZone: "UTC",
        day: "numeric",
        month: "numeric",
        year: "numeric"
      }).toLowerCase().includes(termino)
    );
  };
  console.log("Proyectos:", proyectos);

  const resultados = filtrarProyectos();

  return (
    <AdminLayout current="Documentos">
      <div className="text-gray-800">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-4">Reportes Operativos</h1>
          <button className="bg-[#1F384C] w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-[#27478c]"
            onClick={() => navigate("/documentos")} 
          >
            <FaArrowCircleLeft size={16} />
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre o fecha (YYYY-MM-DD)"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        {loading ? (
          <p>Cargando documentos...</p>
        ) : resultados.length === 0 ? (
          <p>No se encontraron resultados.</p>
        ) : busqueda.trim() ? (
          <table className="w-full table-auto bg-white shadow rounded overflow-hidden">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="p-3">Proyecto</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Boletas</th>
                <th className="p-3">PDF</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((proy) => (
                <tr key={proy._id} className="border-b">
                  <td className="p-3 font-medium">{proy.nombre}</td>
                  <td className="p-3">
                    {new Date(proy.fecha).toLocaleDateString('es-CR', {
                      timeZone: 'UTC',
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="p-3">
                    {proy.imagenesBoletas.map((img, i) => (
                      <a
                        key={i}
                        href={img}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={`boleta-${i + 1}.png`}
                        className="text-blue-600 underline block"
                      >
                        Boleta {i + 1}
                      </a>
                    ))}
                  </td>
                  <td className="p-3">
                    {proy.reportePDF ? (
                      <a
                        href={proy.reportePDF}
                        target="_blank"
                        rel="noopener noreferrer"
                        download="reporte.pdf"
                        className="text-blue-600 underline"
                      >
                        Descargar PDF
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {proyectos.map((proy) => (
              <div key={proy._id} className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-bold mb-2">{proy.nombre}</h2>
                <div className="flex flex-wrap gap-4">
                  {proy.imagenesBoletas.map((img, i) => (
                    <div key={i} className="w-40">
                      <p className="text-sm font-medium mb-1">
                        Boleta {i + 1}
                      </p>
                      <a href={img} target="_blank" rel="noopener noreferrer" download={`Boleta_${i + 1}.png`}>
                        <img
                          src={img}
                          alt={`Boleta ${i + 1}`}
                          className="w-full h-auto rounded shadow"
                        />
                      </a>
                      
                    </div>
                  ))}
                </div>
                {proy.imagenRecorrido && (
                <a href={proy.imagenRecorrido} target="_blank" rel="noopener noreferrer">
                  <img
                      src={proy.imagenRecorrido}
                      alt={`Recorrido`}
                      className="w-full h-auto rounded shadow mt-4"
                    />
                </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}