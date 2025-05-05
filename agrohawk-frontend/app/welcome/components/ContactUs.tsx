import React from "react";

export default function ContactUs() {
  return (
    <section id="contacto" className="bg-white py-16 px-6">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-teal-500 mb-8">
          Contáctanos
        </h2>
        <form className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Nombre*"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
            <input
              type="text"
              placeholder="Apellidos*"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>
          <input
            type="email"
            placeholder="Correo Electrónico*"
            className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
            required
          />
          <input
            type="tel"
            placeholder="Número de teléfono*"
            className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
            required
          />
          <textarea
            placeholder="Tu mensaje..."
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-md resize-none text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-teal-400 hover:bg-teal-500 text-white font-semibold py-3 rounded-full transition"
          >
            Enviar
          </button>
        </form>
      </div>
    </section>
  );
}
