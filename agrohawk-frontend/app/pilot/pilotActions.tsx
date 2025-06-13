import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaBars,
  FaFolderOpen,
  FaTimes,
  FaTrash,
  FaImage,
  FaPlus,
} from "react-icons/fa";
import { API_BASE } from "../../config";
import { useNavigate } from "react-router-dom";

type Proyecto = {
  _id: string;
  nombre: string;
};

export default function PilotProjectPage() {
  const { id } = useParams();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [mensaje, setMensaje] = useState<{
    tipo: "success" | "error";
    texto: string;
  } | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`${API_BASE}/api/proyectos/${id}`)
      .then((res) => res.json())
      .then((data) => setProyecto(data))
      .catch((error) => {
        console.error("Error al obtener proyecto:", error);
      });
  }, [id]);

  useEffect(() => {
    if (mensaje) {
      const timeout = setTimeout(() => setMensaje(null), 5000);
      return () => clearTimeout(timeout);
    }
  }, [mensaje]);

  function SidebarButton({
    label,
    icon,
    active = false,
  }: {
    label: string;
    icon: React.ReactNode;
    active?: boolean;
  }) {
    return (
      <button
        className={`flex items-center w-full px-3 py-2 text-left rounded-md transition-all duration-200 ${
          active
            ? "bg-blue-100 text-blue-700 font-semibold"
            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        }`}
      >
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </button>
    );
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImagenes((prev) => [...prev, ...files]);
    event.target.value = "";
  };

  const removeImage = (indexToRemove: number) => {
    setImagenes((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleUpload = async () => {
    if (!id || imagenes.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    imagenes.forEach((img) => formData.append("imagenes", img));

    try {
      const res = await fetch(`/api/proyectos/${id}/subir-boletas`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje({ tipo: "success", texto: "Imágenes subidas correctamente." });
        setImagenes([]);
      } else {
        setMensaje({
          tipo: "error",
          texto: "Error al subir imágenes: " + data.mensaje,
        });
      }
    } catch (error) {
      console.error("Error al subir imágenes:", error);
      setMensaje({ tipo: "error", texto: "Ocurrió un error al subir las imágenes." });
    } finally {
      setUploading(false);
    }
  };

  const clearAllImages = () => {
    setImagenes([]);
  };

  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-[#1F384C] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src="/logo-round.png"
            alt="Logo"
            className="h-14 object-contain ml-6 sm:ml-10"
          />
          <span className="text-xl sm:text-2xl font-bold">AgroHawk</span>
        </div>

        <div className="mx-auto ml-auto text-lg font-semibold">Piloto</div>

        <div className="relative flex items-center gap-2">
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="focus:outline-none focus:ring-0"
          >
            <img
              src="/user-icon.png"
              alt="Perfil"
              className="h-10 w-10 rounded-full bg-white object-contain"
            />
          </button>

          {menuAbierto && (
            <div className="absolute right-0 top-12 w-40 bg-white border rounded shadow-md z-50">
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="flex flex-1">
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed z-50 top-0 left-0 min-h-screen w-64 bg-gray-100 p-4 border-r shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none`}
        >
          <nav className="space-y-4 mt-16 lg:mt-0">
            <div className="space-y-2">
              <SidebarButton label="Proyectos" icon={<FaFolderOpen />} active />
            </div>
            <hr className="my-4 border-gray-300" />
          </nav>

          <div className="absolute bottom-6 left-4 w-[calc(100%-2rem)]">
            <button
              onClick={() => {
                navigate("/piloto")
              }}
              className="w-full flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors font-semibold"
            >
              Salir
            </button>
          </div>
        </aside>

        <button
          className="lg:hidden absolute top-4 left-2 z-50 text-white bg-blue-800 p-2 rounded-md shadow-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        <main className="flex-1 px-4 py-6 sm:px-6 md:px-8 bg-gray-50 flex flex-col items-center">
          {proyecto ? (
            <>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">
                Nombre del Proyecto: {proyecto.nombre}
              </h1>

              {mensaje && (
                <div
                  className={`w-full max-w-2xl px-4 py-3 mb-6 rounded-md text-sm font-medium ${
                    mensaje.tipo === "success"
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-red-100 text-red-800 border border-red-300"
                  }`}
                >
                  {mensaje.texto}
                </div>
              )}

              <div className="w-full max-w-2xl flex flex-col items-center">
                <h2 className="mb-4 text-xl font-semibold text-gray-700">
                  Gestión de Imágenes de Boletas
                </h2>

                <label
                  htmlFor="file-upload"
                  className="cursor-pointer border-2 border-dashed border-gray-400 rounded-lg p-6 w-full text-center bg-white mb-6 hover:border-blue-400 transition-colors"
                >
                  <FaPlus className="mx-auto text-4xl text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">
                    Arrastra tus imágenes o haz clic aquí para seleccionarlas
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Formatos soportados: JPG, PNG, GIF, WEBP
                  </p>
                </label>

                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  name="imagenes"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />

                {imagenes.length > 0 && (
                  <div className="w-full bg-white rounded-lg shadow-md mb-6">
                    <div className="flex items-center justify-between p-4 border-b">
                      <h3 className="text-lg font-medium text-gray-800 flex items-center">
                        <FaImage className="mr-2" />
                        Archivos seleccionados ({imagenes.length})
                      </h3>
                      <button
                        onClick={clearAllImages}
                        className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                      >
                        <FaTrash className="mr-1" />
                        Limpiar todo
                      </button>
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                      {imagenes.map((file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50"
                        >
                          <div className="flex items-center flex-1 min-w-0">
                            <FaImage className="text-blue-500 mr-3 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeImage(index)}
                            className="ml-3 text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors flex-shrink-0"
                            title="Eliminar archivo"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                  <button
                    onClick={handleUpload}
                    className={`flex-1 px-6 py-3 rounded-md font-medium transition flex items-center justify-center ${
                      imagenes.length === 0 || uploading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    disabled={imagenes.length === 0 || uploading}
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Subiendo...
                      </>
                    ) : (
                      `Subir ${imagenes.length} imagen${
                        imagenes.length !== 1 ? "es" : ""
                      }`
                    )}
                  </button>
                </div>

                {imagenes.length === 0 && (
                  <p className="text-gray-500 text-center mt-4 italic">
                    No hay archivos seleccionados
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 italic">Cargando proyecto...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
