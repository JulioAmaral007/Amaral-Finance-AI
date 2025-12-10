import { Navbar } from '../_components/navbar'

export default function Subscription() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 p-6">
        <h1 className="mb-6 text-2xl font-bold">Assinatura</h1>
        
        <div className="flex items-center justify-center rounded-xl border border-border/40 bg-card p-12">
          <div className="text-center">
            <h2 className="mb-2 text-xl font-semibold">Página em desenvolvimento</h2>
            <p className="text-muted-foreground">
              Em breve você poderá gerenciar sua assinatura aqui.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
