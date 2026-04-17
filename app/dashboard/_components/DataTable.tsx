const columns = ['Fecha', 'Descripción', 'Categoría', 'Monto']

export default function DataTable() {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Transacciones</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200">
              {columns.map(col => (
                <th
                  key={col}
                  className="pb-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wide"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-neutral-400 text-sm">
                Carga un archivo para ver tus transacciones
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
