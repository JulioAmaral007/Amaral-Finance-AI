'use client'

import { Badge } from '@/_components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/_components/ui/card'
import { Label } from '@/_components/ui/label'
import { Progress } from '@/_components/ui/progress'
import { Slider } from '@/_components/ui/slider'
import { Brain, Clock, RefreshCw, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { Sidebar } from '../_components/sidebar'

export default function AIAnalysis() {
  const [salary, setSalary] = useState([8500])
  const [expenses, setExpenses] = useState([6800])
  const [investment, setInvestment] = useState([1000])

  const remaining = salary[0] - expenses[0] - investment[0]
  const emergencyFundTime = Math.ceil((20000 - 12000) / (remaining > 0 ? remaining : 100))

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Análise da IA</h1>
            <p className="text-muted-foreground">Sugestões inteligentes para suas finanças</p>
          </div>
        </header>

        <main className="flex-1 space-y-6 p-6 overflow-auto">
          {/* Análise Principal da IA */}
          <Card className="rounded-2xl shadow-lg border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-blue-900">Análise Inteligente</CardTitle>
              </div>
              <CardDescription className="text-blue-700">
                Baseado nos seus dados financeiros dos últimos 3 meses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white rounded-lg border">
                <h3 className="font-semibold text-blue-900 mb-2">
                  💡 Recomendações Personalizadas
                </h3>
                <div className="space-y-3 text-sm text-blue-800">
                  <p>
                    <strong>Reserva de Emergência:</strong> Com base nos seus gastos atuais de R$
                    6.800/mês, recomendamos uma reserva de R$ 20.400 (3 meses). Você está 60% do
                    caminho!
                  </p>
                  <p>
                    <strong>Otimização de Gastos:</strong> Identificamos que 18% dos seus gastos são
                    com lazer. Reduzindo para 12%, você economizaria R$ 408/mês.
                  </p>
                  <p>
                    <strong>Investimentos:</strong> Com sua sobra atual, sugerimos alocar 70% para
                    reserva de emergência e 30% para investimentos de renda fixa até completar a
                    reserva.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-green-600">R$ 1.190</div>
                  <div className="text-xs text-muted-foreground">Sobra Mensal Ideal</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">7 meses</div>
                  <div className="text-xs text-muted-foreground">Para completar reserva</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">15%</div>
                  <div className="text-xs text-muted-foreground">Taxa ideal de investimento</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Simulador Interativo */}
          <Card className="rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Simulador Interativo
              </CardTitle>
              <CardDescription>
                Ajuste os valores e veja como isso impacta suas finanças
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label>Salário Mensal: R$ {salary[0].toLocaleString('pt-BR')}</Label>
                  <Slider
                    value={salary}
                    onValueChange={setSalary}
                    max={15000}
                    min={3000}
                    step={100}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Gastos Mensais: R$ {expenses[0].toLocaleString('pt-BR')}</Label>
                  <Slider
                    value={expenses}
                    onValueChange={setExpenses}
                    max={salary[0]}
                    min={1000}
                    step={100}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Investimento Mensal: R$ {investment[0].toLocaleString('pt-BR')}</Label>
                  <Slider
                    value={investment}
                    onValueChange={setInvestment}
                    max={salary[0] - expenses[0]}
                    min={0}
                    step={50}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3">Resultado da Simulação</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div
                      className={`text-xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      R$ {remaining.toLocaleString('pt-BR')}
                    </div>
                    <div className="text-xs text-muted-foreground">Sobra Mensal</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-blue-600">{emergencyFundTime} meses</div>
                    <div className="text-xs text-muted-foreground">Para reserva completa</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-purple-600">
                      {((investment[0] / salary[0]) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Taxa de investimento</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-orange-600">
                      {((expenses[0] / salary[0]) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Taxa de gastos</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Indicadores Personalizados */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Tempo para Metas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Reserva de Emergência Completa</span>
                    <Badge variant="secondary">{emergencyFundTime} meses</Badge>
                  </div>
                  <Progress value={(12000 / 20000) * 100} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Viagem Europa (R$ 15.000)</span>
                    <Badge variant="secondary">12 meses</Badge>
                  </div>
                  <Progress value={57} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Carro Novo (R$ 80.000)</span>
                    <Badge variant="secondary">48 meses</Badge>
                  </div>
                  <Progress value={31} />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Potencial de Investimento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-800 mb-1">Cenário Conservador (6% a.a.)</div>
                  <div className="text-lg font-bold text-green-600">R$ 67.200</div>
                  <div className="text-xs text-green-600">Em 5 anos com R$ 1.000/mês</div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-800 mb-1">Cenário Moderado (10% a.a.)</div>
                  <div className="text-lg font-bold text-blue-600">R$ 77.600</div>
                  <div className="text-xs text-blue-600">Em 5 anos com R$ 1.000/mês</div>
                </div>

                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm text-purple-800 mb-1">Cenário Arrojado (15% a.a.)</div>
                  <div className="text-lg font-bold text-purple-600">R$ 92.300</div>
                  <div className="text-xs text-purple-600">Em 5 anos com R$ 1.000/mês</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dicas Rápidas */}
          <Card className="rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle>💡 Dicas Inteligentes</CardTitle>
              <CardDescription>Ações que você pode tomar hoje</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-green-600 mb-2">✅ Pontos Positivos</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Taxa de poupança de 20% está acima da média</li>
                    <li>• Gastos fixos controlados (37% da renda)</li>
                    <li>• Diversificação de investimentos adequada</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-orange-600 mb-2">⚠️ Pontos de Atenção</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Gastos com lazer acima do recomendado</li>
                    <li>• Reserva de emergência incompleta</li>
                    <li>• Falta de metas de longo prazo definidas</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
