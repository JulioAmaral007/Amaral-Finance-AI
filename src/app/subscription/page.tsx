import { Sidebar } from '../_components/sidebar'

export default function Subscription() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Assinatura</h1>
            <p className="text-muted-foreground">Gerencie sua assinatura</p>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Página em desenvolvimento</h2>
              <p className="text-muted-foreground">Em breve você poderá gerenciar sua assinatura aqui.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
