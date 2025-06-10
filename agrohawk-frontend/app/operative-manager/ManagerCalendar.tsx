import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from 'react';
import esLocale from '@fullcalendar/core/locales/es';
import { useNavigate } from 'react-router-dom';
import GerenteLayout from 'components/GerenteLayout';
import { toast } from 'react-toastify';
import { data } from 'react-router';

interface EventoCalendario {
  title: string;
  start: string;
  backgroundColor?: string;
}

const colorPorEstado: Record<string, string> = {
  pendiente: '#f39c12',
  revisado: '#8e44ad',
  completado: '#27ae60'
};

export default function Calendar() {
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [pilotos, setPilotos] = useState<any[]>([]);
  const [drones, setDrones] = useState<any[]>([]);
  const [nuevoProyecto, setNuevoProyecto] = useState({
    nombre: '',
    cliente: '',
    ubicacion: '',
    fecha: '',
    piloto: '',
    dron: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const res = await fetch('/api/proyectos');
        const data = await res.json();

        const eventosFormateados = data.map((proyecto: any) => {
          const estado = proyecto.estado || '';
          const color = colorPorEstado[estado] || '#2980b9';

          return {
            title: `${proyecto.nombre}`,
            start: proyecto.fecha.split('T')[0],
            allDay: true,
            backgroundColor: color,
            extendedProps: {
              _id: proyecto._id
            }
          };
        });

        setEventos(eventosFormateados);
      } catch (err) {
        console.error('Error cargando proyectos:', err);
      }
    };

    cargarEventos();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const resPilotos = await fetch("/api/pilotos");
      const resDrones = await fetch("/api/drones");
      const pilotosData = await resPilotos.json();
      const dronesData = await resDrones.json();
  
      setPilotos(pilotosData);
      setDrones(dronesData);
    };
  
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNuevoProyecto({ ...nuevoProyecto, [e.target.name]: e.target.value });
  };

  // Función para manejar la creación del proyecto
  const handleCrearProyecto = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const decoded = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const creadoPor = decoded?.id;

    try {
      const res = await fetch('/api/proyectos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...nuevoProyecto, creadoPor })
      });

      if (!res.ok) throw new Error('Error al crear proyecto');

      const data = await res.json();

      toast.success("Guardado con éxito", {
        position: "bottom-right",
        autoClose: 3000, 
      });
      setMostrarFormulario(false);

      const nuevoEvento = {
      title: data.proyecto.nombre,
      start: data.proyecto.fecha.split('T')[0],
      backgroundColor: colorPorEstado[data.proyecto.estado] || '#2980b9',
      extendedProps: {
        _id: data.proyecto._id,
      }
    };
      setEventos((prev) => [...prev, nuevoEvento]);

    } catch (err) {
      console.error('Error al crear proyecto:', err);
      toast.error("Guardado con éxito", {
        position: "bottom-right",
        autoClose: 3000, 
      });
    }
  };

  // Evento cuando se hace clic en un día del calendario
  const handleDateClick = (arg: any) => {
    setNuevoProyecto({ ...nuevoProyecto, fecha: arg.dateStr }); 
    setMostrarFormulario(true); 
  };

  return (
    <GerenteLayout>
      <div className="text-gray-800 p-6">
        <h1 className="text-3xl font-bold mb-4">Calendario</h1>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={eventos}
          headerToolbar={{
            left: 'prev,next',
            center: 'title',
            right: ''
          }}
          height="auto"
          locale={esLocale}
          eventClick={(info) => {
            const id = info.event.extendedProps._id;
            if (id) {
              navigate(`/proyecto-gerente/${id}`);
            }
          }}
          eventClassNames={() => 'cursor-pointer'}
          dateClick={handleDateClick} 
        />
      </div>

      {/* Formulario para crear proyecto */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center z-50 text-gray-800">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative border border-gray-800">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              onClick={() => setMostrarFormulario(false)} // Cerrar formulario
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4">Crear Proyecto</h3>

            <form onSubmit={handleCrearProyecto}>
              <div className="mb-4">
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Proyecto
                </label>
                <input
                  id="nombre"
                  type="text"
                  value={nuevoProyecto.nombre}
                  onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, nombre: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="cliente" className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente
                </label>
                <input
                  id="cliente"
                  type="text"
                  value={nuevoProyecto.cliente}
                  onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, cliente: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación
                </label>
                <input
                  id="ubicacion"
                  type="text"
                  value={nuevoProyecto.ubicacion}
                  onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, ubicacion: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Creación
                </label>
                <input
                  id="fecha"
                  type="date"
                  value={nuevoProyecto.fecha}
                  onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, fecha: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium">Piloto</label>
                <select
                  name="piloto"
                  value={nuevoProyecto.piloto}
                  onChange={handleInputChange}
                  className="border px-3 py-2 rounded w-full"
                  required
                >
                  <option value="">Seleccione un piloto</option>
                  {pilotos.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium">Dron</label>
                <select
                  name="dron"
                  value={nuevoProyecto.dron}
                  onChange={handleInputChange}
                  className="border px-3 py-2 rounded w-full"
                  required
                >
                  <option value="">Seleccione un dron</option>
                  {drones.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.modelo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className="bg-red-700 hover:bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#1F384C] hover:bg-[#27478c] text-white px-4 py-2 rounded"
                >
                  Crear Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </GerenteLayout>
  );
}
