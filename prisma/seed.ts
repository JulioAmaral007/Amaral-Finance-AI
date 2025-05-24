import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Criação de usuários
  const users = await prisma.user.createMany({
    data: [
      { name: 'Thais Amaral', email: 'thais@example.com', password: '123456' },
      { name: 'João Silva', email: 'joao@example.com', password: '123456' },
      { name: 'Maria Oliveira', email: 'maria@example.com', password: '123456' },
    ],
  })

  const createdUsers = await prisma.user.findMany()

  // Criação de assinaturas
  const subscriptions = await prisma.subscription.createMany({
    data: [
      { name: 'Netflix', amount: 39.9 },
      { name: 'Spotify', amount: 19.9 },
      { name: 'Amazon Prime', amount: 14.9 },
      { name: 'Adobe Creative Cloud', amount: 99.0 },
    ],
  })

  const createdSubscriptions = await prisma.subscription.findMany()

  // Relacionar assinaturas com usuários
  for (const user of createdUsers) {
    await prisma.userSubscription.createMany({
      data: createdSubscriptions.map(sub => ({
        userId: user.id,
        subscriptionId: sub.id,
      })),
    })
  }

  // Transações por usuário
  for (const user of createdUsers) {
    await prisma.transaction.createMany({
      data: [
        {
          name: 'Aluguel',
          type: 'EXPENSE',
          amount: 1200.0,
          category: 'HOUSING',
          paymentMethod: 'BANK_TRANSFER',
          date: new Date('2024-05-01'),
          userId: user.id,
        },
        {
          name: 'Salário',
          type: 'DEPOSIT',
          amount: 5000.0,
          category: 'SALARY',
          paymentMethod: 'BANK_TRANSFER',
          date: new Date('2024-05-05'),
          userId: user.id,
        },
        {
          name: 'Mercado',
          type: 'EXPENSE',
          amount: 450.75,
          category: 'FOOD',
          paymentMethod: 'CREDIT_CARD',
          date: new Date('2024-05-10'),
          userId: user.id,
        },
        {
          name: 'Cinema',
          type: 'EXPENSE',
          amount: 80.0,
          category: 'ENTERTAINMENT',
          paymentMethod: 'PIX',
          date: new Date('2024-05-15'),
          userId: user.id,
        },
        {
          name: 'Aplicação em Ações',
          type: 'INVESTMENT',
          amount: 1000.0,
          category: 'OTHER',
          paymentMethod: 'BANK_TRANSFER',
          date: new Date('2024-05-20'),
          userId: user.id,
        },
        {
          name: 'Remédio',
          type: 'EXPENSE',
          amount: 120.0,
          category: 'HEALTH',
          paymentMethod: 'DEBIT_CARD',
          date: new Date('2024-05-22'),
          userId: user.id,
        },
      ],
    })
  }

  console.log('✅ Seed finalizado com sucesso!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
