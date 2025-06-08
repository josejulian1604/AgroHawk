import AdminLayout from "../../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useDropzone } from "react-dropzone";

const categorias = [
  {
    nombre: "Reportes Operativos",
    descripcion: "Boletas, mapas de recorrido y reportes PDF generados por proyectos.",
    tipo: "reporte-operativo",
  },
  { 
    nombre: "Minutas",
    descripcion: "Documentos de reunión subidos por el equipo.",
    tipo: "minuta",
  },
  {
    nombre: "Estados Financieros",
    descripcion: "Archivos relacionados con la contabilidad o presupuesto.",
    tipo: "estado-financiero",
  },
  {
    nombre: "Presentaciones",
    descripcion: "Material visual de exposiciones o entregas.",
    tipo: "presentacion",
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
  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: "exito" | "error" } | null>(null);
  const [usuarioId, setUsuarioId] = useState("");
  
 useEffect(() => {
   fetch("/api/proyectos") 
     .then(res => res.json())
     .then(data => setProyectos(data))
     .catch(() => setProyectos([]));
 }, []);

 type DecodedToken = {
  id: string;
  nombre: string;
  rol: string;
};

const { getRootProps, getInputProps, isDragActive } = useDropzone({
  accept: {
    "application/pdf": [],
    "application/msword": [],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
    "application/vnd.ms-excel": [],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
    "application/vnd.ms-powerpoint": [],
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": [],
    "image/png": [],
    "image/jpeg": [],
  },
  maxFiles: 1,
  onDrop: (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setArchivo(acceptedFiles[0]);
    }
  },
});

useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode<DecodedToken>(token);
    setUsuarioId(decoded.id); 
  }
}, []);

const handleSubirDocumento = async () => {
  if (!titulo || !tipo || !archivo) {
    setMensaje({ texto: "Por favor completa el título, tipo y selecciona un archivo.", tipo: "error" });
    setTimeout(() => setMensaje(null), 3000);
    return;
  }

  setSubiendo(true);
  setMensaje(null);

  try {
    const reader = new FileReader();

    reader.onloadend = async () => {
      const archivoURL = reader.result;

      const payload = {
        titulo,
        tipo,
        archivoURL,
        subidoPor: usuarioId,
        relacionadoAProyecto: proyectoId || undefined,
      };
      
      const res = await fetch("/api/documentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();

      if (res.ok) {
        setMensaje({ texto: "Documento subido correctamente.", tipo: "exito" });
        setMostrarModal(false);
        setTitulo("");
        setTipo("");
        setArchivo(null);
        setProyectoId("");
      } else {
        setMensaje({ texto: data.mensaje || "Error al subir documento.", tipo: "error" });
      }
      setSubiendo(false);
      setTimeout(() => setMensaje(null), 4000);
    };
    console.log(titulo,tipo,archivo,usuarioId)
    reader.readAsDataURL(archivo); 
  } catch (err) {
    console.error("Error al subir documento:", err);
    setSubiendo(false);
    setMensaje({ texto: "Ocurrió un error al subir el documento.", tipo: "error" });
  }
};
  return (
    <AdminLayout current="Documentos">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Documentos</h1>
        <button
          onClick={() => setMostrarModal(true)}
          className="bg-green-800 hover:bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Agregar Documento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categorias.map((categoria) => (
          <div
            key={categoria.tipo}
            className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition"
            onClick={() => {
              if (categoria.tipo === "reporte-operativo") {
                navigate("/documentos/reportes-operativos");
              } else {
                console.log("Tipo: ",categoria.tipo);
                navigate(`/documentos/${categoria.tipo}`);
              }
            }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{categoria.nombre}</h2>
            <p className="text-gray-600">{categoria.descripcion}</p>
          </div>
        ))}
      </div>

      {mostrarModal && (
        <div className="text-gray-800 fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center z-50">
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
                <option value="estado-financiero">Estado financiero</option>
                <option value="presentacion">Presentación</option>
              </select>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded p-6 text-center cursor-pointer transition ${
                  isDragActive ? "bg-blue-50 border-blue-400" : "border-gray-400"
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center">
                  <svg
                    className="w-10 h-10 text-blue-500 mb-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 15a4 4 0 014-4h.26a8 8 0 0115.48 2.04A5 5 0 0120 21H7a4 4 0 01-4-4zm9-4v6m0 0l-2.5-2.5M12 17l2.5-2.5"
                  />
                  </svg>
                  <p className="text-gray-600">
                    {archivo ? archivo.name : "Haz clic o arrastra un archivo aquí"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSubirDocumento}
                disabled={subiendo}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
              >
                {subiendo ? "Subiendo..." : "Subir documento"}
              </button>
            </div>
          </div>
        </div>
      )}

      {mensaje && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow text-white z-50 transition ${
            mensaje.tipo === "exito" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {mensaje.texto}
        </div>
      )}
    </AdminLayout>
  );
}
