import React from "react";

export default function HeroSection() {
  return (
    <section
      className="relative bg-[#0c0c0c]/90 text-white w-full px-6 py-12 md:py-20 overflow-hidden"
      style={{ fontFamily: '"Roboto Serif", serif' }}
    >
      {/* Fondo decorativo más visible */}
      <img
        src="/background-pattern.png"
        alt="Decoración de fondo"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-30 pointer-events-none z-0"
      />

      {/* Estrellas decorativas */}
      <img
        src="/stars.png"
        alt="Estrellas"
        className="absolute top-10 left-10 w-24 h-24 opacity-50 pointer-events-none z-10"
      />

      {/* Contenedor principal */}
      <div className="relative z-20 flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto px-4">
        {/* Texto */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Agricultura más segura,<br />
            eficiente y moderna.
          </h1>
          <p className="text-2xl md:text-3xl text-teal-300 font-semibold">
            Fumigación y monitoreo con drones de última generación.
          </p>
          <button className="mt-4 bg-white text-black font-medium px-5 py-2 rounded-full shadow hover:bg-gray-200 flex items-space-bewtween gap-3">
            <span className="w-6 h-6 flex items-center justify-center bg-black text-white rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
            <span>Ver Servicios</span>
          </button>


        </div>

        {/* Imagen con círculos concéntricos ajustados */}
        <div className="relative w-[300px] md:w-[400px] lg:w-[450px] aspect-square z-20">
          {/* Primer círculo: separarlo más de la imagen */}
          <div className="absolute inset-[1px] rounded-full border-2 border-teal-400 scale-[1.1] opacity-50"></div>

          {/* Segundo círculo: más amplio, pero no exagerado */}
          <div className="absolute inset-0 rounded-full border-2 border-teal-600 scale-[1.2] opacity-30 pointer-events-none"></div>

          {/* Imagen del dron */}
          <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-teal-400 shadow-lg">
            <img
              src="/dron-portada.png"
              alt="Dron sobre cultivo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Estadísticas: se mantienen cerca y centradas */}
      <div className="relative z-20 flex flex-wrap justify-center gap-12 mt-12 max-w-5xl mx-auto">
        {[
          { value: "1200+", label: "Servicios brindados" },
          { value: "3000+", label: "Hectáreas cubiertas" },
          { value: "150+", label: "Clientes satisfechos" },
          { value: "500+", label: "Horas de vuelo" },
        ].map((item, index) => (
          <div key={index} className="text-center">
            <p className="text-5xl font-bold text-teal-400">{item.value}</p>
            <p className="text-base text-white">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

