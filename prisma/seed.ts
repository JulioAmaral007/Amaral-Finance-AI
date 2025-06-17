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
    // Transações fixas
    await prisma.transaction.createMany({
      data: [
        {
          name: 'Aluguel',
          type: 'EXPENSE',
          amount: 1200.0,
          category: 'HOUSING',
          date: new Date('2024-05-01'),
          userId: user.id,
          isFixed: true,
        },
        {
          name: 'Salário',
          type: 'DEPOSIT',
          amount: 5000.0,
          category: 'SALARY',
          date: new Date('2024-05-05'),
          userId: user.id,
          isFixed: true,
        },
      ],
    })

    // Transações parceladas
    const installmentGroupId = crypto.randomUUID()
    const installmentAmount = 1200.0
    const totalInstallments = 6

    for (let i = 0; i < totalInstallments; i++) {
      const installmentDate = new Date('2024-05-01')
      installmentDate.setMonth(installmentDate.getMonth() + i)

      await prisma.transaction.create({
        data: {
          name: 'Notebook Dell',
          type: 'EXPENSE',
          amount: installmentAmount / totalInstallments,
          category: 'OTHER',
          date: installmentDate,
          userId: user.id,
          isInstallment: true,
          totalInstallments,
          currentInstallment: i + 1,
          installmentGroupId,
        },
      })
    }

    // Transações normais
    await prisma.transaction.createMany({
      data: [
        {
          name: 'Mercado',
          type: 'EXPENSE',
          amount: 450.75,
          category: 'FOOD',
          date: new Date('2024-05-10'),
          userId: user.id,
        },
        {
          name: 'Cinema',
          type: 'EXPENSE',
          amount: 80.0,
          category: 'ENTERTAINMENT',
          date: new Date('2024-05-15'),
          userId: user.id,
        },
        {
          name: 'Aplicação em Ações',
          type: 'INVESTMENT',
          amount: 1000.0,
          category: 'OTHER',
          date: new Date('2024-05-20'),
          userId: user.id,
        },
        {
          name: 'Remédio',
          type: 'EXPENSE',
          amount: 120.0,
          category: 'HEALTH',
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
