# Auto Ultimate - Fleet & Rental Management Dashboard

Sistema completo de gerenciamento de frotas e aluguel de veículos.

## 🚀 Pré-requisitos
- Node.js (v18+)
- Conta no Supabase (PostgreSQL)

## 🛠️ Configuração do Supabase
1. Crie um projeto no Supabase.
2. Rode os scripts SQL fornecidos na documentação na aba "SQL Editor".
3. Crie um bucket no "Storage" chamado `vehicle-images` e deixe-o público.
4. Copie a `Project URL`, `anon key` e `service_role key` para os arquivos `.env`.

## 💻 Como Rodar Localmente

**1. Backend:**
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`
O servidor rodará em `http://localhost:3001`.

**2. Frontend:**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
O app React rodará em `http://localhost:5173`.