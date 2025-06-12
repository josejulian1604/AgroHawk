import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GerenteLayout from "../../components/GerenteLayout";
import { FaArrowCircleLeft, FaTrashAlt } from "react-icons/fa";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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

export default function ManagerProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<string>("");
  const [vistaPreviaPDF, setVistaPreviaPDF] = useState<string | null>(null);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [proyectoAEliminar, setProyectoAEliminar] = useState<Proyecto | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  useEffect(() => {
    const fetchProyecto = async () => {
      try {
        const res = await fetch(`/api/proyectos/${id}`);
        const data = await res.json();
        setProyecto(data);
        setNuevoEstado(data.status || "");
      } catch (error) {
        console.error("Error al obtener proyecto:", error);
      }
    };

    fetchProyecto();
  }, [id]);

  if (!proyecto) return (<GerenteLayout current="Proyectos">
    <p className="text-gray-800">Cargando...</p>
    </GerenteLayout>
    );

  if (!proyecto) {
    return (
      <GerenteLayout current="Proyectos">
        <p className="text-gray-800">Cargando proyecto...</p>
      </GerenteLayout>
    );
  }
  const generarReportePDF = async (proyecto: Proyecto) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;

  // 🔵 Página 1: Header + cuadro
  const contenido1 = document.createElement("div");
  contenido1.style.width = "800px";
  contenido1.style.padding = "40px";
  contenido1.style.backgroundColor = "#fff";
  contenido1.style.color = "#000";
  contenido1.style.fontFamily = "sans-serif";
  contenido1.style.lineHeight = "1.6";

  contenido1.innerHTML = `
    <img src="/header.png" style="width:100%; margin-bottom:20px;" />
    <h2 style="text-align:center;">REPORTE DE FUMIGACIÓN</h2>
    <table style="width:100%; border-collapse: collapse; font-size: 14px;">
      ${[
        ["CLIENTE", proyecto.cliente],
        ["FECHA", new Date(proyecto.fecha).toLocaleDateString('es-CR')],
        ["PILOTO", proyecto.piloto?.nombre || ""],
        ["CULTIVO", proyecto.cultivo || ""],
        ["FINCA", proyecto.finca],
        ["BLOQUE", proyecto.bloque],
        ["HECTÁREAS", proyecto.hectareas || "" + " ha"],
        ["PRODUCTO", proyecto.producto || ""],
        ["BOQUILLAS", proyecto.boquillas || ""],
        ["ANCHO", proyecto.anchoAplicado || "" + " m"],
        ["ALTURA", proyecto.alturaAplicada || "" + " m"],
        ["VOLUMEN", proyecto.volumenAplicado || "" + " LTS/HA"]
      ].map(([label, val]) => `
        <tr>
          <td style="border:1px solid #000; font-weight:bold; padding:6px;">${label}</td>
          <td style="border:1px solid #000; padding:6px;">${val}</td>
        </tr>`).join("")}
    </table>
  `;
  document.body.appendChild(contenido1);
  await new Promise(res => setTimeout(res, 300));
  const canvas1 = await html2canvas(contenido1, { scale: 1, useCORS: true });
  const img1 = canvas1.toDataURL("image/png");
  const imgHeight1 = (canvas1.height * contentWidth) / canvas1.width;
  doc.addImage(img1, "PNG", margin, margin, contentWidth, imgHeight1);
  document.body.removeChild(contenido1);

  // 🟡 Página 2: Boletas
  if (proyecto.imagenesBoletas?.length) {
    doc.addPage();
    let posY = margin;

    for (let i = 0; i < proyecto.imagenesBoletas.length; i++) {
      const imgURL = proyecto.imagenesBoletas[i];
      const img = await cargarImagen(imgURL);
      const imgHeight = (img.height * contentWidth) / img.width;

      if (i > 0) posY += 10;
      doc.addImage(img, "JPEG", margin, posY, contentWidth, imgHeight);
      posY += imgHeight;
    }
  }

  // 🟢 Página 3: Recorrido + Footer
  if (proyecto.imagenRecorrido || true) {
    doc.addPage();
    let posY = margin;

    if (proyecto.imagenRecorrido) {
      const recorrido = await cargarImagen(proyecto.imagenRecorrido);
      const recorridoHeight = (recorrido.height * contentWidth) / recorrido.width;
      doc.addImage(recorrido, "JPEG", margin, posY, contentWidth, recorridoHeight);
      posY += recorridoHeight + 10;
    }

    const footer = await cargarImagen("/footer.png");
    const footerHeight = (footer.height * contentWidth) / footer.width;
    doc.addImage(footer, "PNG", margin, posY, contentWidth, footerHeight);
  }

  const blob = await doc.output("blob");
  return URL.createObjectURL(blob);
};


const cargarImagen = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};
  
  const handleGenerarReporte = async () => {
    const base64 = await generarReportePDF(proyecto);
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

  const handleSubirRecorrido = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !proyecto?._id) return;
  
    const formData = new FormData();
    formData.append("imagen", file);
  
    try {
      const res = await fetch(`/api/proyectos/${proyecto._id}/subir-recorrido`, {
        method: "POST",
        body: formData, 
      });
  
      if (!res.ok) throw new Error("Error al subir recorrido");
  
      const data = await res.json();
      toast.success("Recorrido agregado correctamente.");
      setProyecto((prev) => prev ? { ...prev, imagenRecorrido: data.imagenRecorrido } : prev);
    } catch (err) {
      console.error("Error al subir recorrido", err);
      toast.error("Error al subir recorrido.");
    }
  };

  const handleAgregarComentario = async () => {
    if (!nuevoComentario.trim() || !proyecto?._id) return;
  
    try {
      const res = await fetch(`/api/proyectos/${proyecto._id}/comentario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: nuevoComentario.trim() }),
      });
  
      if (!res.ok) throw new Error("Error al agregar comentario");
  
      const data = await res.json();
      setProyecto((prev) => prev ? { ...prev, comentarios: data.comentarios } : prev);
      setNuevoComentario("");
    } catch (err) {
      console.error("Error:", err);
      toast.error("No se pudo agregar el comentario.");
    }
  };

  const handleCambiarEstado = async () => {
    if (!proyecto) return;
  
    try {
      // Si se marca como completado, generar PDF y subirlo
      if (nuevoEstado === "completado") {
        const blobURL = await generarReportePDF(proyecto);
  
        const blob = await fetch(blobURL).then(res => res.blob());

        const formData = new FormData();
        formData.append("reportePDF", blob, "reporte.pdf"); 

        const resPDF = await fetch(`/api/proyectos/${proyecto._id}/reporte`, {
          method: "PUT",
          body: formData, 
        });

        if (!resPDF.ok) throw new Error("Error al subir el PDF");
      }
  
      // Luego actualizar el estado
      const resEstado = await fetch(`/api/proyectos/${proyecto._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nuevoEstado }),
      });
  
      if (!resEstado.ok) throw new Error("Error al actualizar estado");
  
      const data = await resEstado.json();
      setProyecto(data.proyecto);
      toast.success("Estado actualizado correctamente.");
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      toast.error("Ocurrió un error al cambiar el estado.");
    }
  };
  
  const confirmarEliminacion = async () => {
    if (!proyectoAEliminar) return;
    
    try {
      const response = await fetch(`/api/proyectos/${proyectoAEliminar._id}`, {
        method: "DELETE",
      });
    
      const data = await response.json();
      if (!response.ok) throw new Error(data.mensaje || "Error al eliminar");
      
      toast.success("Proyecto eliminado con éxito", {
        position: "bottom-right",
        autoClose: 3000, 
      });
      setMostrarConfirmacion(false);
      setProyectoAEliminar(null);
      navigate("/gerente")
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al eliminar", {
        position: "bottom-right",
        autoClose: 3000, 
      });
    }
  };

  return (
    <GerenteLayout current="Proyectos">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="text-gray-800 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Resumen del Proyecto</h1>
          <button className="bg-[#1F384C] w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-[#27478c]"
          onClick={() => navigate("/gerente")} 
        >
          <FaArrowCircleLeft size={16} />
        </button>
        </div>  

        {/* Tarjeta principal del proyecto */}
        <div className="bg-white rounded shadow p-4 gap-6">
          <h2 className="text-xl font-semibold mb-2">{proyecto.nombre}</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-1">
            <p><strong>Cliente:</strong> {proyecto.cliente}</p>
            <p><strong>Ubicación:</strong> {proyecto.ubicacion}</p>
            <p><strong>Fecha:</strong> {new Date(proyecto.fecha).toLocaleDateString('es-CR', {
              timeZone: 'UTC',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}</p>
            <p><strong>Status:</strong> {proyecto.status}</p>
            <div className="ml-auto flex flex-col gap-3">
                <button className="bg-[#1F384C] p-3 rounded-full text-white hover:bg-[#8b1c1c]"
                onClick={() => {
                    setProyectoAEliminar(proyecto);
                    setMostrarConfirmacion(true);
                }}
                >
                  <FaTrashAlt size={18} />
                </button>
            </div>
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
             <label htmlFor="estado" className="text-sm font-medium text-gray-700 mb-1 block">Estado actual:</label>
             <select
               id="estado"
               value={nuevoEstado}
               onChange={(e) => setNuevoEstado(e.target.value)}
               className="border px-3 py-2 rounded w-full mb-4"
             >
               <option value="pendiente">Pendiente</option>
               <option value="en revisión">En Revisión</option>
               <option value="completado">Completado</option>
             </select>
             <button
               className="bg-[#1F384C] hover:bg-[#27478c] text-white px-4 py-2 rounded"
               onClick={handleCambiarEstado}
             >
               Guardar Estado
             </button>
          </div>

          <div className="flex items-center justify-center">
            <label
              htmlFor="file-recorrido"
              className="cursor-pointer bg-[#1F384C] hover:bg-[#27478c] text-white px-4 py-2 rounded text-center"
            >
              Agregar Boleta de Recorrido
            </label>
            <input
              id="file-recorrido"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleSubirRecorrido}
            />
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
        <div className="mt-4">
          <textarea
            className="w-full border rounded p-2 text-sm"
            placeholder="Escribe un nuevo comentario..."
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
          />
          <button
            onClick={handleAgregarComentario}
            className="mt-2 px-4 py-2 bg-[#1F384C] hover:bg-[#27478c] text-white rounded"
          >
            Agregar Comentario
          </button>
        </div>
      </div>
      
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

      {mostrarConfirmacion && proyectoAEliminar && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex justify-center items-center z-50 text-gray-800">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm text-center border border-gray-800">
            <h2 className="text-xl font-bold mb-2">¿Desea eliminar a este Dron?</h2>
            <p className="text-sm text-gray-600 mb-6">
              Se eliminará permanentemente el dron: <br />
              <strong>{proyectoAEliminar.nombre}</strong>
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
    </GerenteLayout>
  );
}
