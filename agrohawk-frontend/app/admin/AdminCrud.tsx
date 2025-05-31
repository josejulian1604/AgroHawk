import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { FaRegEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

type Admin = {
  _id: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  cedula: string;
  telefono: string;
  correo: string;
};

export default function AdminCrud() {
  const [admins, setAdmins] = useState<Admin[]>([]);

  useEffect(() => {
    const obtenerAdmins = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/admins");
        if (!response.ok) {
          throw new Error("Error al obtener administradores");
        }
        const data = await response.json();
        setAdmins(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    obtenerAdmins();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido1: "",
    apellido2: "",
    cedula: "",
    telefono: "",
    correo: "",
    contraseña: "",
  });

  const handleCrearAdmin = async () => {
    const erroresValidados = validarCampos();

    if (erroresValidados.length > 0) {
      setErrores(erroresValidados);
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, rol: "admin" }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.mensaje ||"Error al crear administrador");

      setAdmins((prev) => [...prev, data.usuario]);

      setShowModal(false);
      setErrores([]);
      setFormData({
        nombre: "",
        apellido1: "",
        apellido2: "",
        cedula: "",
        telefono: "",
        correo: "",
        contraseña: "",
      });
    } catch (error:any) {
      console.error(error);
      setErrores([error.message]);
    }
  };


  const [errores, setErrores] = useState<string[]>([]);
  const validarCampos = () => {
    const nuevosErrores: string[] = [];

    if (!formData.nombre.trim()) nuevosErrores.push("El nombre es obligatorio");
    if (!formData.apellido1.trim()) nuevosErrores.push("El primer apellido es obligatorio");
    if (!formData.apellido2.trim()) nuevosErrores.push("El segundo apellido es obligatorio");
    if (!formData.cedula.trim()) nuevosErrores.push("La cédula es obligatoria");
    if (!formData.telefono.trim()) nuevosErrores.push("El número de teléfono es obligatorio");

    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(formData.correo)) nuevosErrores.push("El correo no es válido");

    if (formData.contraseña.length < 6) nuevosErrores.push("La contraseña debe tener al menos 6 caracteres");
    if (formData.cedula.length < 9) nuevosErrores.push("La Cédula debe ser en formato X 0XXX 0XXX");
    if (formData.telefono.length < 8) nuevosErrores.push("El número de teléfono debe contener al menos 8 dígitos.");

    return nuevosErrores;
  };



  return (
    <AdminLayout current="Administradores">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Administradores</h1>
        <button
            className="bg-[#1F384C] w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-[#27478c]"
            onClick={() => {
              setFormData({
                nombre: "",
                apellido1: "",
                apellido2: "",
                cedula: "",
                telefono: "",
                correo: "",
                contraseña: "",
              });
              setErrores([]);
              setShowModal(true);
            }}

          >
            <FaPlus size={16} />
        </button>
      </div>
      <div className="space-y-6">
        {admins.map((admin, index) => (
          <div
            key={admin._id}
            className="bg-white p-6 rounded-lg shadow border flex justify-normal items-center text-gray-800"
          >
            <div>
              <h2 className="text-xl font-semibold mb-2">
                {admin.nombre + " " + admin.apellido1}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-bold">Nombre Completo</p>
                  <p>{admin.nombre + " " + admin.apellido1 + " " +  admin.apellido2}</p>
                </div>
                <div>
                  <p className="font-bold">Cédula</p>
                  <p>{admin.cedula}</p>
                </div>
                <div>
                  <p className="font-bold">Número de Teléfono</p>
                  <p>{admin.telefono}</p>
                </div>
                <div>
                  <p className="font-bold">Correo electrónico</p>
                  <p>{admin.correo}</p>
                </div>
              </div>
            </div>
            <div className="ml-auto flex flex-col gap-3">
              <button className="bg-[#1F384C] p-3 rounded-full text-white hover:bg-[#27478c]">
                <FaRegEdit size={18} />
              </button>
              <button className="bg-[#1F384C] p-3 rounded-full text-white hover:bg-[#8b1c1c]">
                <FaTrashAlt size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-gray-800">
          <div className="bg-white p-6 rounded-lg w-full max-w-md text-gray-800">
            <h2 className="text-xl font-bold mb-4 ">Agregar Administrador</h2>
            {errores.length > 0 && (
              <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
                <ul className="list-disc list-inside text-sm">
                  {errores.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="space-y-3">
              <input
                className="w-full border px-3 py-2 rounded"
                type="text"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
              <input
                className="w-full border px-3 py-2 rounded"
                type="text"
                placeholder="Primer Apellido"
                value={formData.apellido1}
                onChange={(e) => setFormData({ ...formData, apellido1: e.target.value })}
              />
              <input
                className="w-full border px-3 py-2 rounded"
                type="text"
                placeholder="Segundo Apellido"
                value={formData.apellido2}
                onChange={(e) => setFormData({ ...formData, apellido2: e.target.value })}
              />
              <input
                className="w-full border px-3 py-2 rounded"
                type="text"
                placeholder="Cédula"
                value={formData.cedula}
                onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
              />
              <input
                className="w-full border px-3 py-2 rounded"
                type="text"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />
              <input
                className="w-full border px-3 py-2 rounded"
                type="email"
                placeholder="Correo"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
              />
              <input
                className="w-full border px-3 py-2 rounded"
                type="password"
                placeholder="Contraseña"
                value={formData.contraseña}
                onChange={(e) => setFormData({ ...formData, contraseña: e.target.value })}
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className="bg-[#1F384C] text-white px-4 py-2 rounded"
                  onClick={handleCrearAdmin}
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
