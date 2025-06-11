export type MonthDocument = {
    month: string;      // "Abril 2025"
    reports: number;    // 6
    status: string;      // "En ejecución", "Completado"
    acres: number;     // 200+ Hectareas fumigadas
};

export async function getDocuments(): Promise<MonthDocument[]> {
    // Simulate fetching documents from an API
    return [
        {
            month: "Abril 2025",
            reports: 6,
            status: "En ejecución",
            acres: 200
        },
        {
            month: "Mayo 2025",
            reports: 4,
            status: "Completado",
            acres: 150
        },
        {
            month: "Junio 2025",
            reports: 8,
            status: "En ejecución",
            acres: 300
        },
        {
            month: "Julio 2025",
            reports: 10,
            status: "Completado",
            acres: 250
        }
    ];
}