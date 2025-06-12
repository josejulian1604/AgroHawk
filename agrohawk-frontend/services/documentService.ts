import { API_BASE } from "../config";

export type MonthDocument = {
    month: string;      // "Abril 2025"
    reports: number;    // 6
};

export type Document = {
  _id: string;
  titulo: string;
  tipo: string; // "minuta", "estado financiero", "presentación", "reporte operativo"
  archivoURL: string;
  fechaSubida: string;
};

export async function getDocuments(): Promise<MonthDocument[]> {
    const response = await fetch(`${API_BASE}/api/documentos/meses`);

    if (!response.ok) {
        throw new Error("Error al obtener documentos");
    }

    return await response.json();
}

export async function getDocumentsByMonth(month: string): Promise<Document[]> {
    const response = await fetch(`${API_BASE}/api/documentos/mes/${encodeURIComponent(month)}`);

    if (!response.ok) {
        throw new Error("Error al obtener documentos por mes");
    }

    return await response.json();
}