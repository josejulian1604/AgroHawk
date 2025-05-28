import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";

type Admin = {
  _id: string;
  nombre: string;
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

  return (
    <AdminLayout current="Administradores">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Administradores</h1>

      <div className="space-y-6">
        {admins.map((admin, index) => (
          <div
            key={admin._id}
            className="bg-white p-6 rounded-lg shadow border flex justify-normal items-center text-gray-800"
          >
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Administrador {index + 1}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-bold">Nombre Completo</p>
                  <p>{admin.nombre}</p>
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
    </AdminLayout>
  );
}
