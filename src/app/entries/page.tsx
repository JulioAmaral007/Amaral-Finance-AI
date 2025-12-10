'use client'

import { Badge } from '@/_components/ui/badge'
import { Button } from '@/_components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/_components/ui/card'
import { Input } from '@/_components/ui/input'
import { Label } from '@/_components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/_components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/_components/ui/tabs'
import { Textarea } from '@/_components/ui/textarea'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Sidebar } from '../_components/sidebar'

export default function Entries() {
  const [fixedExpenses, setFixedExpenses] = useState([
    { id: 1, name: 'Aluguel', value: 1500, recurrence: 'mensal' },
    { id: 2, name: 'Internet', value: 100, recurrence: 'mensal' },
  ])

  const [variableExpenses, setVariableExpenses] = useState([
    { id: 1, category: 'Alimentação', value: 250, date: '2024-01-15' },
    { id: 2, category: 'Lazer', value: 120, date: '2024-01-14' },
  ])

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Entradas Financeiras</h1>
            <p className="text-muted-foreground">Cadastre suas receitas e despesas</p>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Tabs defaultValue="income" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="income">Renda</TabsTrigger>
              <TabsTrigger value="fixed-expenses">Despesas Fixas</TabsTrigger>
              <TabsTrigger value="variable-expenses">Despesas Variáveis</TabsTrigger>
              <TabsTrigger value="installments">Parceladas</TabsTrigger>
              <TabsTrigger value="investments">Investimentos</TabsTrigger>
            </TabsList>

            <TabsContent value="income">
              <Card className="rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle>Cadastrar Renda</CardTitle>
                  <CardDescription>Registre suas fontes de renda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="income-type">Tipo de Renda</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Renda Fixa</SelectItem>
                          <SelectItem value="variable">Renda Variável</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="income-value">Valor</Label>
                      <Input id="income-value" placeholder="R$ 0,00" type="number" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequência</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a frequência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Mensal</SelectItem>
                        <SelectItem value="biweekly">Quinzenal</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Renda
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fixed-expenses">
              <div className="space-y-6">
                <Card className="rounded-2xl shadow-lg">
                  <CardHeader>
                    <CardTitle>Cadastrar Despesa Fixa</CardTitle>
                    <CardDescription>Registre suas despesas recorrentes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expense-name">Nome da Despesa</Label>
                        <Input id="expense-name" placeholder="Ex: Aluguel, Internet..." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expense-value">Valor</Label>
                        <Input id="expense-value" placeholder="R$ 0,00" type="number" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recurrence">Recorrência</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a recorrência" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Mensal</SelectItem>
                          <SelectItem value="yearly">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Despesa Fixa
                    </Button>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl shadow-lg">
                  <CardHeader>
                    <CardTitle>Despesas Fixas Cadastradas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {fixedExpenses.map(expense => (
                        <div
                          key={expense.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{expense.name}</p>
                            <p className="text-sm text-muted-foreground">
                              R$ {expense.value.toLocaleString('pt-BR')} - {expense.recurrence}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="variable-expenses">
              <div className="space-y-6">
                <Card className="rounded-2xl shadow-lg">
                  <CardHeader>
                    <CardTitle>Cadastrar Despesa Variável</CardTitle>
                    <CardDescription>Registre gastos pontuais</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Categoria</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="food">Alimentação</SelectItem>
                            <SelectItem value="entertainment">Lazer</SelectItem>
                            <SelectItem value="transport">Transporte</SelectItem>
                            <SelectItem value="health">Saúde</SelectItem>
                            <SelectItem value="education">Educação</SelectItem>
                            <SelectItem value="others">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="variable-value">Valor</Label>
                        <Input id="variable-value" placeholder="R$ 0,00" type="number" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expense-date">Data do Gasto</Label>
                      <Input id="expense-date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição (opcional)</Label>
                      <Textarea id="description" placeholder="Descreva o gasto..." />
                    </div>
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Despesa
                    </Button>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl shadow-lg">
                  <CardHeader>
                    <CardTitle>Despesas Variáveis Recentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {variableExpenses.map(expense => (
                        <div
                          key={expense.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{expense.category}</Badge>
                              <p className="font-medium">
                                R$ {expense.value.toLocaleString('pt-BR')}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground">{expense.date}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="installments">
              <Card className="rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle>Cadastrar Compra Parcelada</CardTitle>
                  <CardDescription>Registre compras parceladas para controle</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="installment-description">Descrição</Label>
                    <Input id="installment-description" placeholder="Ex: Notebook, Geladeira..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="total-value">Valor Total</Label>
                      <Input id="total-value" placeholder="R$ 0,00" type="number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="num-installments">Número de Parcelas</Label>
                      <Input id="num-installments" placeholder="12" type="number" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="remaining-installments">Parcelas Restantes</Label>
                    <Input id="remaining-installments" placeholder="8" type="number" />
                  </div>
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Compra Parcelada
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="investments">
              <Card className="rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle>Cadastrar Investimento</CardTitle>
                  <CardDescription>Registre seus investimentos e reservas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="investment-type">Tipo de Investimento</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed-income">Renda Fixa</SelectItem>
                          <SelectItem value="variable-income">Renda Variável</SelectItem>
                          <SelectItem value="emergency-fund">Reserva de Emergência</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="investment-value">Valor</Label>
                      <Input id="investment-value" placeholder="R$ 0,00" type="number" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform">Plataforma/Banco</Label>
                    <Input id="platform" placeholder="Ex: XP, Nubank, Inter..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="current-reserve">Reserva de Emergência Atual</Label>
                    <Input id="current-reserve" placeholder="R$ 12.000,00" type="number" />
                  </div>
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Investimento
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
