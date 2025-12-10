import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes
  await prisma.aIAnalysis.deleteMany()
  await prisma.goal.deleteMany()
  await prisma.investment.deleteMany()
  await prisma.installmentPurchase.deleteMany()
  await prisma.variableExpense.deleteMany()
  await prisma.fixedExpense.deleteMany()
  await prisma.income.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // Criar categorias
  console.log('📂 Criando categorias...')
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Alimentação',
        description: 'Gastos com comida, restaurantes e mercado',
        color: '#10B981',
        icon: 'UtensilsCrossed',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Transporte',
        description: 'Combustível, transporte público, manutenção',
        color: '#3B82F6',
        icon: 'Car',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Lazer',
        description: 'Entretenimento, cinema, jogos, hobbies',
        color: '#8B5CF6',
        icon: 'Gamepad2',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Saúde',
        description: 'Médicos, medicamentos, academia',
        color: '#EF4444',
        icon: 'Heart',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Educação',
        description: 'Cursos, livros, material de estudo',
        color: '#F59E0B',
        icon: 'GraduationCap',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Vestuário',
        description: 'Roupas, calçados, acessórios',
        color: '#EC4899',
        icon: 'Shirt',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Casa',
        description: 'Móveis, decoração, utensílios domésticos',
        color: '#6B7280',
        icon: 'Home',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Outros',
        description: 'Gastos diversos não categorizados',
        color: '#64748B',
        icon: 'MoreHorizontal',
      },
    }),
  ])

  // Criar usuário exemplo
  console.log('👤 Criando usuário exemplo...')
  const user = await prisma.user.create({
    data: {
      email: 'joao.silva@email.com',
      name: 'João Silva',
      phone: '(11) 99999-9999',
      monthlyIncome: 8500.0,
      emergencyReserve: 12000.0,
      emergencyGoal: 20000.0,
      expenseAlerts: true,
      goalReminders: true,
      aiSuggestions: true,
      monthlyReports: false,
      theme: 'SYSTEM',
      currency: 'BRL',
      animationsEnabled: true,
    },
  })

  // Criar rendas
  console.log('💰 Criando rendas...')
  await Promise.all([
    prisma.income.create({
      data: {
        userId: user.id,
        type: 'FIXED',
        amount: 7500.0,
        frequency: 'MONTHLY',
        description: 'Salário CLT - Desenvolvedor Senior',
      },
    }),
    prisma.income.create({
      data: {
        userId: user.id,
        type: 'VARIABLE',
        amount: 1000.0,
        frequency: 'MONTHLY',
        description: 'Freelances e projetos extras',
      },
    }),
  ])

  // Criar despesas fixas
  console.log('🏠 Criando despesas fixas...')
  await Promise.all([
    prisma.fixedExpense.create({
      data: {
        userId: user.id,
        name: 'Aluguel',
        amount: 1800.0,
        frequency: 'MONTHLY',
        description: 'Apartamento 2 quartos - Centro',
        dueDay: 10,
      },
    }),
    prisma.fixedExpense.create({
      data: {
        userId: user.id,
        name: 'Condomínio',
        amount: 350.0,
        frequency: 'MONTHLY',
        description: 'Taxa condominial',
        dueDay: 10,
      },
    }),
    prisma.fixedExpense.create({
      data: {
        userId: user.id,
        name: 'Internet',
        amount: 99.9,
        frequency: 'MONTHLY',
        description: 'Fibra 500MB',
        dueDay: 15,
      },
    }),
    prisma.fixedExpense.create({
      data: {
        userId: user.id,
        name: 'Energia Elétrica',
        amount: 180.0,
        frequency: 'MONTHLY',
        description: 'Conta de luz',
        dueDay: 20,
      },
    }),
    prisma.fixedExpense.create({
      data: {
        userId: user.id,
        name: 'Plano de Saúde',
        amount: 450.0,
        frequency: 'MONTHLY',
        description: 'Unimed Individual',
        dueDay: 5,
      },
    }),
    prisma.fixedExpense.create({
      data: {
        userId: user.id,
        name: 'Academia',
        amount: 89.9,
        frequency: 'MONTHLY',
        description: 'Smart Fit',
        dueDay: 12,
      },
    }),
    prisma.fixedExpense.create({
      data: {
        userId: user.id,
        name: 'Streaming',
        amount: 45.9,
        frequency: 'MONTHLY',
        description: 'Netflix + Spotify',
        dueDay: 8,
      },
    }),
  ])

  // Criar despesas variáveis dos últimos 30 dias
  console.log('🛒 Criando despesas variáveis...')
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const variableExpenses = [
    {
      categoryName: 'Alimentação',
      amount: 85.5,
      description: 'Mercado - compras da semana',
      daysAgo: 2,
    },
    { categoryName: 'Alimentação', amount: 45.0, description: 'Restaurante - almoço', daysAgo: 5 },
    {
      categoryName: 'Alimentação',
      amount: 120.3,
      description: 'Supermercado - compras mensais',
      daysAgo: 8,
    },
    { categoryName: 'Transporte', amount: 60.0, description: 'Combustível', daysAgo: 3 },
    { categoryName: 'Transporte', amount: 25.5, description: 'Uber', daysAgo: 7 },
    { categoryName: 'Lazer', amount: 80.0, description: 'Cinema + pipoca', daysAgo: 10 },
    { categoryName: 'Lazer', amount: 150.0, description: 'Jantar com amigos', daysAgo: 12 },
    { categoryName: 'Saúde', amount: 35.9, description: 'Farmácia - medicamentos', daysAgo: 6 },
    { categoryName: 'Educação', amount: 89.9, description: 'Curso online Udemy', daysAgo: 15 },
    { categoryName: 'Vestuário', amount: 199.9, description: 'Camisa social', daysAgo: 18 },
    { categoryName: 'Casa', amount: 75.0, description: 'Produtos de limpeza', daysAgo: 4 },
    { categoryName: 'Outros', amount: 50.0, description: 'Presente aniversário', daysAgo: 20 },
  ]

  for (const expense of variableExpenses) {
    const category = categories.find(c => c.name === expense.categoryName)
    if (category) {
      const expenseDate = new Date(now.getTime() - expense.daysAgo * 24 * 60 * 60 * 1000)
      await prisma.variableExpense.create({
        data: {
          userId: user.id,
          categoryId: category.id,
          amount: expense.amount,
          description: expense.description,
          date: expenseDate,
        },
      })
    }
  }

  // Criar compras parceladas
  console.log('💳 Criando compras parceladas...')
  await Promise.all([
    prisma.installmentPurchase.create({
      data: {
        userId: user.id,
        description: 'Notebook Dell Inspiron 15',
        totalAmount: 3500.0,
        installmentAmount: 291.67,
        totalInstallments: 12,
        paidInstallments: 4,
        startDate: new Date('2024-09-01'),
      },
    }),
    prisma.installmentPurchase.create({
      data: {
        userId: user.id,
        description: 'Geladeira Brastemp Frost Free',
        totalAmount: 2800.0,
        installmentAmount: 233.33,
        totalInstallments: 12,
        paidInstallments: 8,
        startDate: new Date('2024-05-01'),
      },
    }),
    prisma.installmentPurchase.create({
      data: {
        userId: user.id,
        description: 'Sofá 3 lugares',
        totalAmount: 1200.0,
        installmentAmount: 200.0,
        totalInstallments: 6,
        paidInstallments: 6,
        isCompleted: true,
        startDate: new Date('2024-01-01'),
      },
    }),
  ])

  // Criar investimentos
  console.log('📈 Criando investimentos...')
  await Promise.all([
    prisma.investment.create({
      data: {
        userId: user.id,
        type: 'FIXED_INCOME',
        name: 'Tesouro Selic 2029',
        amount: 15000.0,
        currentValue: 15750.0,
        platform: 'Tesouro Direto',
        purchaseDate: new Date('2024-01-15'),
      },
    }),
    prisma.investment.create({
      data: {
        userId: user.id,
        type: 'FIXED_INCOME',
        name: 'CDB Banco Inter',
        amount: 8000.0,
        currentValue: 8320.0,
        platform: 'Banco Inter',
        purchaseDate: new Date('2024-03-10'),
      },
    }),
    prisma.investment.create({
      data: {
        userId: user.id,
        type: 'VARIABLE_INCOME',
        name: 'ITSA4 - Itaúsa',
        amount: 5000.0,
        currentValue: 5400.0,
        platform: 'XP Investimentos',
        purchaseDate: new Date('2024-02-20'),
      },
    }),
    prisma.investment.create({
      data: {
        userId: user.id,
        type: 'VARIABLE_INCOME',
        name: 'PETR4 - Petrobras',
        amount: 3000.0,
        currentValue: 3200.0,
        platform: 'XP Investimentos',
        purchaseDate: new Date('2024-04-05'),
      },
    }),
    prisma.investment.create({
      data: {
        userId: user.id,
        type: 'EMERGENCY_RESERVE',
        name: 'Nubank - Conta Poupança',
        amount: 12000.0,
        currentValue: 12000.0,
        platform: 'Nubank',
        purchaseDate: new Date('2023-12-01'),
      },
    }),
    prisma.investment.create({
      data: {
        userId: user.id,
        type: 'FIXED_INCOME',
        name: 'LCI Santander',
        amount: 10000.0,
        currentValue: 10450.0,
        platform: 'Santander',
        purchaseDate: new Date('2024-01-30'),
      },
    }),
  ])

  // Criar metas
  console.log('🎯 Criando metas...')
  await Promise.all([
    prisma.goal.create({
      data: {
        userId: user.id,
        name: 'Viagem para Europa',
        description: 'Viagem de 15 dias pela Europa visitando França, Itália e Espanha',
        targetAmount: 15000.0,
        currentAmount: 8500.0,
        targetDate: new Date('2024-12-31'),
        category: 'TRAVEL',
        priority: 'HIGH',
      },
    }),
    prisma.goal.create({
      data: {
        userId: user.id,
        name: 'Carro Novo',
        description: 'Compra de um carro 0km - Honda Civic ou similar',
        targetAmount: 80000.0,
        currentAmount: 25000.0,
        targetDate: new Date('2027-06-30'),
        category: 'CAR',
        priority: 'MEDIUM',
      },
    }),
    prisma.goal.create({
      data: {
        userId: user.id,
        name: 'Reserva de Emergência Completa',
        description: 'Reserva equivalente a 6 meses de gastos para emergências',
        targetAmount: 20000.0,
        currentAmount: 12000.0,
        targetDate: new Date('2024-08-31'),
        category: 'EMERGENCY',
        priority: 'HIGH',
      },
    }),
    prisma.goal.create({
      data: {
        userId: user.id,
        name: 'Curso de MBA',
        description: 'MBA em Gestão de Projetos na FGV',
        targetAmount: 25000.0,
        currentAmount: 5000.0,
        targetDate: new Date('2025-03-01'),
        category: 'EDUCATION',
        priority: 'MEDIUM',
      },
    }),
    prisma.goal.create({
      data: {
        userId: user.id,
        name: 'Entrada do Apartamento',
        description: 'Entrada de 20% para financiamento de apartamento próprio',
        targetAmount: 60000.0,
        currentAmount: 15000.0,
        targetDate: new Date('2026-12-31'),
        category: 'HOUSE',
        priority: 'HIGH',
      },
    }),
  ])

  // Criar análises da IA
  console.log('🤖 Criando análises da IA...')
  await Promise.all([
    prisma.aIAnalysis.create({
      data: {
        userId: user.id,
        analysisType: 'monthly_summary',
        content: JSON.stringify({
          totalIncome: 8500.0,
          totalExpenses: 6800.0,
          savingsRate: 20,
          expensesByCategory: {
            Moradia: 2150.0,
            Alimentação: 1200.0,
            Transporte: 800.0,
            Saúde: 450.0,
            Lazer: 600.0,
            Outros: 600.0,
          },
        }),
        recommendations: [
          'Sua taxa de poupança de 20% está excelente, acima da média nacional de 15%',
          'Considere reduzir gastos com lazer de R$ 600 para R$ 400 mensais',
          'Priorize completar sua reserva de emergência antes de novos investimentos',
        ],
        confidence: 0.85,
      },
    }),
    prisma.aIAnalysis.create({
      data: {
        userId: user.id,
        analysisType: 'goal_suggestion',
        content: JSON.stringify({
          suggestedGoal: 'Curso de Especialização',
          estimatedCost: 5000.0,
          potentialROI: '20% de aumento salarial',
          timeToAchieve: '5 meses',
        }),
        recommendations: [
          'Um curso de especialização pode aumentar sua renda em até 20%',
          'Com sua sobra atual de R$ 1.700, você pode economizar R$ 1.000/mês para esta meta',
          'Considere cursos em áreas de alta demanda como Cloud Computing ou Data Science',
        ],
        confidence: 0.78,
      },
    }),
    prisma.aIAnalysis.create({
      data: {
        userId: user.id,
        analysisType: 'expense_optimization',
        content: JSON.stringify({
          optimizationPotential: 408.0,
          categories: ['Lazer', 'Alimentação'],
          suggestions: {
            Lazer: 'Reduzir de 18% para 12% da renda',
            Alimentação: 'Cozinhar mais em casa pode economizar R$ 200/mês',
          },
        }),
        recommendations: [
          'Você gasta 18% da renda com lazer, a média recomendada é 10-12%',
          'Cozinhando mais em casa, pode economizar até R$ 200/mês em alimentação',
          'Com essas otimizações, você teria R$ 408 extras mensais para investir',
        ],
        confidence: 0.82,
      },
    }),
  ])

  console.log('✅ Seed concluído com sucesso!')
  console.log(`👤 Usuário criado: ${user.email}`)
  console.log(`📂 ${categories.length} categorias criadas`)
  console.log('💰 Dados financeiros populados')
  console.log('🎯 Metas financeiras criadas')
  console.log('🤖 Análises da IA geradas')
}

main()
  .catch(e => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
