import AdminLayout from "../../components/AdminLayout";

type DecodedToken = {
  nombre: string;
  rol: string;
};

export default function AdminPage() {

  return (
    <AdminLayout current="Proyectos">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Proyectos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow border flex justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Fumigación Caribe</h2>
              <p className="text-sm text-gray-500">6 de abril 2025</p>
              <p className="mt-2 italic text-gray-700">
                Reportes cargados: 6 <br />
                Estado: En ejecución
              </p>
              <div className="mt-4 border rounded p-2 bg-gray-100 text-center text-gray-800">
                <p className="text-xl font-bold">200+</p>
                <p className="text-sm text-gray-500">Hectáreas Fumigadas</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center text-sm text-gray-800">
                Gráfico
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}