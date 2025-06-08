import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import esLocale from '@fullcalendar/core/locales/es';
import { useNavigate } from 'react-router-dom';

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

  return (
    <AdminLayout>
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
              navigate(`/proyectos/${id}`);
            }
          }}
          eventClassNames={() => 'cursor-pointer'}
        />
      </div>
    </AdminLayout>
  );
}
