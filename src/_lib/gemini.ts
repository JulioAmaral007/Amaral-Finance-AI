import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY não encontrada nas variáveis de ambiente')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 2048,
  },
})

export interface FinancialData {
  monthlyIncome: number
  monthlyExpenses: number
  monthlyInvestment: number
  emergencyReserve: number
  emergencyGoal: number
  expensesByCategory: Record<string, number>
  investments: Array<{
    type: string
    amount: number
    currentValue?: number
  }>
  goals: Array<{
    name: string
    targetAmount: number
    currentAmount: number
    targetDate: string
  }>
}

export async function generateFinancialAnalysis(data: FinancialData): Promise<{
  summary: string
  recommendations: string[]
  insights: string[]
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  savingsRate: number
}> {
  const prompt = `
Você é um consultor financeiro especializado em finanças pessoais. Analise os dados financeiros abaixo e forneça uma análise detalhada em português brasileiro.

DADOS FINANCEIROS:
- Renda mensal: R$ ${data.monthlyIncome.toLocaleString('pt-BR')}
- Gastos mensais: R$ ${data.monthlyExpenses.toLocaleString('pt-BR')}
- Investimento mensal: R$ ${data.monthlyInvestment.toLocaleString('pt-BR')}
- Reserva de emergência atual: R$ ${data.emergencyReserve.toLocaleString('pt-BR')}
- Meta de reserva de emergência: R$ ${data.emergencyGoal.toLocaleString('pt-BR')}

GASTOS POR CATEGORIA:
${Object.entries(data.expensesByCategory)
  .map(([cat, value]) => `- ${cat}: R$ ${value.toLocaleString('pt-BR')}`)
  .join('\n')}

INVESTIMENTOS:
${data.investments
  .map(
    inv =>
      `- ${inv.type}: R$ ${inv.amount.toLocaleString('pt-BR')} (atual: R$ ${(inv.currentValue || inv.amount).toLocaleString('pt-BR')})`
  )
  .join('\n')}

METAS:
${data.goals
  .map(
    goal =>
      `- ${goal.name}: R$ ${goal.currentAmount.toLocaleString('pt-BR')} / R$ ${goal.targetAmount.toLocaleString('pt-BR')} (prazo: ${goal.targetDate})`
  )
  .join('\n')}

Forneça sua resposta EXATAMENTE no seguinte formato JSON:
{
  "summary": "Resumo geral da situação financeira em 2-3 frases",
  "recommendations": ["recomendação 1", "recomendação 2", "recomendação 3"],
  "insights": ["insight 1", "insight 2", "insight 3"],
  "riskLevel": "LOW|MEDIUM|HIGH",
  "savingsRate": número_da_taxa_de_poupança_em_porcentagem
}

Seja específico, prático e use valores em reais. Foque em ações concretas que a pessoa pode tomar.
`

  try {
    const result = await geminiModel.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Tentar extrair JSON da resposta
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Resposta da IA não está no formato JSON esperado')
    }

    const analysis = JSON.parse(jsonMatch[0])
    return analysis
  } catch (error) {
    console.error('Erro ao gerar análise financeira:', error)

    // Fallback com análise básica
    const savingsRate = ((data.monthlyIncome - data.monthlyExpenses) / data.monthlyIncome) * 100
    return {
      summary: 'Análise temporariamente indisponível. Seus dados foram processados localmente.',
      recommendations: [
        'Mantenha o controle de gastos atualizado',
        'Priorize completar sua reserva de emergência',
        'Diversifique seus investimentos',
      ],
      insights: [
        `Sua taxa de poupança atual é de ${savingsRate.toFixed(1)}%`,
        'Continue monitorando seus gastos mensalmente',
        'Considere revisar suas metas periodicamente',
      ],
      riskLevel: savingsRate < 10 ? 'HIGH' : savingsRate < 20 ? 'MEDIUM' : 'LOW',
      savingsRate: Math.round(savingsRate),
    }
  }
}

export async function generateGoalSuggestions(data: FinancialData): Promise<{
  suggestedGoals: Array<{
    name: string
    description: string
    estimatedAmount: number
    timeframe: string
    priority: 'LOW' | 'MEDIUM' | 'HIGH'
  }>
}> {
  const monthlySurplus = data.monthlyIncome - data.monthlyExpenses - data.monthlyInvestment

  const prompt = `
Você é um consultor financeiro. Com base nos dados financeiros, sugira 3 metas financeiras realistas e específicas para o usuário.

SITUAÇÃO FINANCEIRA:
- Renda mensal: R$ ${data.monthlyIncome.toLocaleString('pt-BR')}
- Sobra mensal: R$ ${monthlySurplus.toLocaleString('pt-BR')}
- Reserva atual: R$ ${data.emergencyReserve.toLocaleString('pt-BR')}

METAS ATUAIS:
${data.goals.map(goal => `- ${goal.name}: ${((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}% concluída`).join('\n')}

Responda EXATAMENTE no formato JSON:
{
  "suggestedGoals": [
    {
      "name": "Nome da meta",
      "description": "Descrição detalhada",
      "estimatedAmount": valor_numerico,
      "timeframe": "X meses",
      "priority": "LOW|MEDIUM|HIGH"
    }
  ]
}

Seja específico com valores em reais e prazos realistas.
`

  try {
    const result = await geminiModel.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Resposta da IA não está no formato JSON esperado')
    }

    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Erro ao gerar sugestões de metas:', error)

    // Fallback com sugestões básicas
    return {
      suggestedGoals: [
        {
          name: 'Curso de Especialização',
          description: 'Investir em educação para aumentar a renda',
          estimatedAmount: 5000,
          timeframe: '6 meses',
          priority: 'HIGH' as const,
        },
        {
          name: 'Fundo de Oportunidades',
          description: 'Reserva para aproveitar boas oportunidades de investimento',
          estimatedAmount: 10000,
          timeframe: '12 meses',
          priority: 'MEDIUM' as const,
        },
      ],
    }
  }
}
