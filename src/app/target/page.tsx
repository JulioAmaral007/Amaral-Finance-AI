'use client'

import { Badge } from '@/_components/ui/badge'
import { Button } from '@/_components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/_components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog'
import { Input } from '@/_components/ui/input'
import { Label } from '@/_components/ui/label'
import { Progress } from '@/_components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/_components/ui/select'
import { Textarea } from '@/_components/ui/textarea'
import { DollarSign, Edit, Plus, Target, Trash2, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { Sidebar } from '../_components/sidebar'

export default function FinancialGoals() {
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: 'Viagem para Europa',
      targetValue: 15000,
      currentValue: 8500,
      deadline: '2024-12-31',
      category: 'Lazer',
      description: 'Viagem de 15 dias pela Europa',
    },
    {
      id: 2,
      name: 'Carro Novo',
      targetValue: 80000,
      currentValue: 25000,
      deadline: '2027-06-30',
      category: 'Transporte',
      description: 'Compra de um carro 0km',
    },
    {
      id: 3,
      name: 'Reserva de Emergência',
      targetValue: 20000,
      currentValue: 12000,
      deadline: '2024-08-31',
      category: 'Segurança',
      description: '3 meses de gastos para emergências',
    },
  ])

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const calculateRemainingMonths = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
    return Math.max(diffMonths, 0)
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Metas Financeiras</h1>
            <p className="text-muted-foreground">Crie e acompanhe suas metas financeiras</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Meta
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Criar Nova Meta</DialogTitle>
                <DialogDescription>
                  Defina uma nova meta financeira para acompanhar seu progresso
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome-meta">Nome da Meta</Label>
                  <Input id="nome-meta" placeholder="Ex: Casa própria, viagem..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valor-alvo">Valor Alvo</Label>
                    <Input id="valor-alvo" placeholder="R$ 0,00" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valor-atual">Valor Atual</Label>
                    <Input id="valor-atual" placeholder="R$ 0,00" type="number" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prazo">Prazo</Label>
                  <Input id="prazo" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="carro">Carro</SelectItem>
                      <SelectItem value="viagem">Viagem</SelectItem>
                      <SelectItem value="educacao">Educação</SelectItem>
                      <SelectItem value="emergencia">Emergência</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea id="descricao" placeholder="Descreva sua meta..." />
                </div>
                <Button className="w-full">Criar Meta</Button>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <main className="flex-1 space-y-6 p-6 overflow-auto">
          {/* Resumo das Metas */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-2xl shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Metas</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{goals.length}</div>
                <p className="text-xs text-muted-foreground">
                  {
                    goals.filter(
                      goal => calculateProgress(goal.currentValue, goal.targetValue) === 100
                    ).length
                  }{' '}
                  concluídas
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Total das Metas</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R${' '}
                  {goals.reduce((acc, goal) => acc + goal.targetValue, 0).toLocaleString('pt-BR')}
                </div>
                <p className="text-xs text-muted-foreground">
                  R${' '}
                  {goals.reduce((acc, goal) => acc + goal.currentValue, 0).toLocaleString('pt-BR')}{' '}
                  economizados
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Progresso Médio</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    goals.reduce(
                      (acc, goal) => acc + calculateProgress(goal.currentValue, goal.targetValue),
                      0
                    ) / goals.length
                  )}
                  %
                </div>
                <p className="text-xs text-muted-foreground">Média de todas as metas</p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Metas */}
          <div className="space-y-4">
            {goals.map(goal => {
              const progress = calculateProgress(goal.currentValue, goal.targetValue)
              const remainingMonths = calculateRemainingMonths(goal.deadline)
              const monthlyNeeded =
                remainingMonths > 0 ? (goal.targetValue - goal.currentValue) / remainingMonths : 0

              return (
                <Card key={goal.id} className="rounded-2xl shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {goal.name}
                          <Badge variant="secondary">{goal.category}</Badge>
                        </CardTitle>
                        <CardDescription>{goal.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress} className="h-3" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>R$ {goal.currentValue.toLocaleString('pt-BR')}</span>
                        <span>R$ {goal.targetValue.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">
                          R$ {(goal.targetValue - goal.currentValue).toLocaleString('pt-BR')}
                        </div>
                        <div className="text-xs text-muted-foreground">Falta para a meta</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">
                          {remainingMonths} meses
                        </div>
                        <div className="text-xs text-muted-foreground">Tempo restante</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-600">
                          R$ {monthlyNeeded.toLocaleString('pt-BR')}
                        </div>
                        <div className="text-xs text-muted-foreground">Necessário/mês</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Sugestões da IA */}
          <Card className="rounded-2xl shadow-lg border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Target className="h-5 w-5" />
                Sugestões Inteligentes para Metas
              </CardTitle>
              <CardDescription className="text-blue-700">
                Com base no seu padrão de consumo e renda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    💡 Meta Sugerida: Curso de Especialização
                  </h4>
                  <p className="text-sm text-blue-800 mb-2">
                    Com base no seu perfil, um curso de R$ 5.000 pode aumentar sua renda em 20%.
                  </p>
                  <div className="text-xs text-blue-600">
                    Tempo estimado: 5 meses economizando R$ 1.000/mês
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    🏠 Meta Sugerida: Entrada do Apartamento
                  </h4>
                  <p className="text-sm text-blue-800 mb-2">
                    Para um imóvel de R$ 300.000, você precisará de R$ 60.000 de entrada.
                  </p>
                  <div className="text-xs text-blue-600">
                    Tempo estimado: 50 meses economizando R$ 1.200/mês
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  📊 Análise das Suas Metas Atuais
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Sua reserva de emergência está quase completa - priorize ela primeiro</li>
                  <li>
                    • A meta do carro pode ser adiada para focar em investimentos de maior retorno
                  </li>
                  <li>• Considere parcelar a viagem para não comprometer outras metas</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
