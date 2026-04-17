import FileUpload from './_components/FileUpload'
import StatCards from './_components/StatCards'
import DataTable from './_components/DataTable'

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Análisis de gastos</h1>
      <FileUpload />
      <StatCards />
      <DataTable />
    </div>
  )
}
