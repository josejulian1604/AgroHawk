import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { FaArrowCircleLeft } from "react-icons/fa";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

type Proyecto = {
  _id: string;
  nombre: string;
  cliente: string;
  ubicacion: string;
  fecha: string;
  status: string;
  cultivo?: string;
  hectareas?: number;
  finca?:string;
  bloque?:string;
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
  anchoAplicado?: number;
  imagenRecorrido?:string;
};

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [editando, setEditando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [vistaPreviaPDF, setVistaPreviaPDF] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cultivo: "",
    hectareas: "",
    finca: "",
    bloque: "",
    producto: "",
    boquillas: "",
    alturaAplicada: "",
    volumenAplicado: "",
    anchoAplicado:"",
  });
  
  useEffect(() => {
    if (proyecto) {
      setFormData({
        cultivo: proyecto.cultivo || "",
        hectareas: proyecto.hectareas?.toString() || "",
        finca: proyecto.finca || "",
        bloque: proyecto.bloque || "",
        producto: proyecto.producto || "",
        boquillas: proyecto.boquillas || "",
        alturaAplicada: proyecto.alturaAplicada?.toString() || "",
        volumenAplicado: proyecto.volumenAplicado?.toString() || "",
        anchoAplicado: proyecto.anchoAplicado?.toString() || ""
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
      setProyecto(actualizado.proyecto);
      setEditando(false);
      setMostrarModal(false);
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
  const generarReportePDF = async (proyecto: Proyecto) => {
    const doc = new jsPDF();

    const contenido = document.createElement("div");
    contenido.style.position = "absolute";
    contenido.style.top = "0";
    contenido.style.left = "0";
    contenido.style.zIndex = "-9999";
    contenido.style.width = "800px";
    contenido.style.padding = "40px";
    contenido.style.backgroundColor = "#fff";
    contenido.style.color = "#000";
    contenido.style.fontFamily = "sans-serif";
    contenido.style.lineHeight = "1.6";
    contenido.style.overflow = "visible";

    contenido.innerHTML = `
      <img src="/header.png" style="width:100%; margin-bottom:20px;" />
      <h2 style="text-align:center; color:#000;">REPORTE DE FUMIGACIÓN</h2>
      <table style="width:100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
        ${[
          ["CLIENTE", proyecto.cliente],
          ["FECHA", new Date(proyecto.fecha).toLocaleDateString('es-CR')],
          ["PILOTO", proyecto.piloto?.nombre || ""],
          ["CULTIVO", proyecto.cultivo],
          ["FINCA", proyecto.finca],
          ["BLOQUE", proyecto.bloque],
          ["HECTÁREAS", proyecto.hectareas + " ha"],
          ["PRODUCTO", proyecto.producto],
          ["BOQUILLAS", proyecto.boquillas],
          ["ANCHO", proyecto.anchoAplicado + " m"],
          ["ALTURA", proyecto.alturaAplicada + " m"],
          ["VOLUMEN", proyecto.volumenAplicado + " LTS/HA"]
        ].map(([label, val]) => `
          <tr>
            <td style="border:1px solid #000; font-weight:bold; padding:6px;">${label}</td>
            <td style="border:1px solid #000; padding:6px;">${val}</td>
          </tr>`).join("")}
      </table>
      <h4>Imágenes Adjuntas</h4>
      ${(proyecto.imagenesBoletas ?? []).map((img, i) =>
        `<img src="${img}" style="width:100%; margin-bottom:10px;" alt="Boleta ${i + 1}" />`).join("")}
      ${proyecto.imagenRecorrido
        ? `<img src="${proyecto.imagenRecorrido}" style="width:100%; margin-top:10px;" alt="Recorrido" />`
        : ""}
      <img src="/footer.png" style="width:100%; margin-top:30px;" />
    `;

    document.body.appendChild(contenido);
    await new Promise(resolve => setTimeout(resolve, 500));

    const canvas = await html2canvas(contenido, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff"
    });

    const imgData = canvas.toDataURL("image/png");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      doc.addPage();
      doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    document.body.removeChild(contenido);

    const blob = await doc.output("blob");
    return URL.createObjectURL(blob);
  };
  
  const handleGenerarReporte = async () => {
    console.log("Generando reporte...");
    const base64 = await generarReportePDF(proyecto);
    console.log("Vista previa PDF generada:", base64);
    setVistaPreviaPDF(base64); 
  };

  const handleDescargarReporte = async () => {
    const url = await generarReportePDF(proyecto);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_${proyecto.nombre || "proyecto"}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // liberar recursos
  };
  
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <p><strong>Cliente:</strong> {proyecto.cliente}</p>
            <p><strong>Ubicación:</strong> {proyecto.ubicacion}</p>
            <p><strong>Fecha:</strong> {new Date(proyecto.fecha).toLocaleDateString('es-CR', {
              timeZone: 'UTC',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}</p>
            <p><strong>Status:</strong> {proyecto.status}</p>
          </div>
        </div>

        {/* Detalles Técnicos */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Detalles Técnicos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><strong>Cultivo:</strong> {proyecto.cultivo || "-"}</div>
            <div><strong>Finca:</strong> {proyecto.finca || "-"}</div>
            <div><strong>Bloque:</strong> {proyecto.bloque || "-"}</div>
            <div><strong>Hectáreas:</strong> {proyecto.hectareas ? `${proyecto.hectareas} ha` : "-"}</div>
            <div><strong>Producto:</strong> {proyecto.producto || "-"}</div>
            <div><strong>Boquillas:</strong> {proyecto.boquillas || "-"}</div>
            <div><strong>Volumen:</strong> {proyecto.volumenAplicado ? `${proyecto.volumenAplicado} LTS/HA` : "-"}</div>
            <div><strong>Altura:</strong> {proyecto.alturaAplicada ? `${proyecto.alturaAplicada} m` : "-"}</div>
            <div><strong>Ancho Aplicado:</strong> {proyecto.anchoAplicado ? `${proyecto.anchoAplicado} m` : "-"}</div>
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
              <button className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded w-fit self-start"
              onClick={handleGenerarReporte}>
                Previsualizar Reporte
              </button>
              <button className="bg-green-800 hover:bg-green-600 text-white px-4 py-2 rounded w-fit self-start"
              onClick={handleDescargarReporte}>
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
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center z-50 text-gray-800">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg relative border border-gray-800">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              onClick={() => setMostrarModal(false)}
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4">Editar Detalles Técnicos</h3>

            {/* Campos del formulario */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { label: "Cultivo", name: "cultivo" },
                { label: "Producto", name: "producto" },
                { label: "Boquillas", name: "boquillas" },
                { label: "Finca", name: "finca" },
                { label: "Bloque", name: "bloque" }
              ].map(({ label, name }) => (
                <div key={name} className="flex flex-col">
                  <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    id={name}
                    name={name}
                    type="text"
                    value={formData[name as keyof typeof formData]}
                    onChange={handleInputChange}
                    className="border px-3 py-2 rounded"
                  />
                </div>
              ))}

              {[
                { label: "Hectáreas", name: "hectareas" },
                { label: "Volumen Aplicado (LTS/HA)", name: "volumenAplicado" },
                { label: "Altura Aplicada (m)", name: "alturaAplicada" },
                { label: "Ancho Aplicado (m)", name: "anchoAplicado" }
              ].map(({ label, name }) => (
                <div key={name} className="flex flex-col">
                  <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    id={name}
                    name={name}
                    type="number"
                    step="any"
                    value={formData[name as keyof typeof formData]}
                    onChange={handleInputChange}
                    className="border px-3 py-2 rounded"
                  />
                </div>
              ))}
            </div>
            
            {/* Boletas asociadas */}
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
                <p className="text-sm text-gray-500 italic">
                  Aún no se han agregado boletas al proyecto.
                </p>
              )}
            </div>
            
            {/* Botones */}
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
      {vistaPreviaPDF && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl h-[90vh] rounded shadow relative flex flex-col">
            <button
              className="absolute top-2 right-3 text-xl text-gray-600 hover:text-black"
              onClick={() => setVistaPreviaPDF(null)}
            >
              ✕
            </button>
            <iframe
              src={vistaPreviaPDF}
              className="flex-1 w-full rounded-b"
              frameBorder="0"
            ></iframe>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
