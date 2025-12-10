# Finance AI 💰

Sistema de controle financeiro pessoal com IA, construído com Next.js 16 e Supabase.

## 🚀 Tecnologias

- **Next.js 16** - Framework React com App Router
- **Supabase** - Autenticação, Banco de Dados e Row Level Security
- **Tailwind CSS 4** - Estilização
- **Recharts** - Gráficos
- **React Hook Form + Zod** - Formulários e validação

## 📋 Funcionalidades

- ✅ Dashboard com visão geral financeira
- ✅ Gerenciamento de transações (ganhos, gastos, investimentos)
- ✅ Gráficos de distribuição por tipo e categoria
- ✅ Autenticação com e-mail/senha ou Google
- ✅ Row Level Security (usuários só acessam seus próprios dados)
- ✅ Filtro por mês

## ⚙️ Configuração

### 1. Clone o repositório

```bash
git clone <repo-url>
cd finance-ai
npm install
```

### 2. Crie um projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Vá em **Settings > API** e copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

### 4. Crie as tabelas no Supabase

Vá em **SQL Editor** no Supabase Dashboard e execute o SQL:

```sql
-- Criar tipos enum
CREATE TYPE transaction_type AS ENUM ('DEPOSIT', 'EXPENSE', 'INVESTMENT');
CREATE TYPE transaction_category AS ENUM ('HOUSING', 'TRANSPORTATION', 'FOOD', 'ENTERTAINMENT', 'HEALTH', 'UTILITY', 'SALARY', 'EDUCATION', 'OTHER');
CREATE TYPE transaction_payment_method AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'BANK_SLIP', 'CASH', 'PIX', 'OTHER');

-- Criar tabela de transações
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type transaction_type NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category transaction_category NOT NULL,
  payment_method transaction_payment_method,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);

-- Habilitar Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON transactions FOR DELETE USING (auth.uid() = user_id);
```

### 5. Configure autenticação (opcional - Google)

1. Vá em **Authentication > Providers > Google**
2. Configure as credenciais OAuth do [Google Cloud Console](https://console.cloud.google.com)
3. Adicione a URL de callback: `https://seu-projeto.supabase.co/auth/v1/callback`

### 6. Execute o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
src/
├── _actions/          # Server Actions
├── _components/       # Componentes UI reutilizáveis
├── _constants/        # Constantes e labels
├── _data/             # Funções de busca de dados
├── _lib/
│   ├── supabase/      # Clientes Supabase (server/client)
│   ├── auth.ts        # Helpers de autenticação
│   └── utils.ts       # Utilitários
├── app/
│   ├── (home)/        # Dashboard
│   ├── transactions/  # Página de transações
│   ├── subscription/  # Página de assinatura
│   ├── login/         # Página de login
│   └── auth/          # Callback OAuth
├── types/             # Tipos TypeScript
└── middleware.ts      # Proteção de rotas
```

## 🎨 Telas

- **Dashboard** (`/`) - Visão geral com saldo, cards, gráficos e últimas transações
- **Transações** (`/transactions`) - Tabela com todas as transações
- **Login** (`/login`) - Autenticação com e-mail ou Google

## 🔒 Segurança

O projeto usa **Row Level Security (RLS)** do Supabase, garantindo que:
- Usuários só podem ver suas próprias transações
- Não é possível acessar dados de outros usuários
- As políticas são aplicadas diretamente no banco de dados

## 📝 Scripts

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Verificar código
```

## 📄 Licença

MIT
