# 🌆 CleanWork

Aplicativo web para transparência e participação comunitária em São Luís — visualize obras públicas no mapa, submeta demandas e acompanhe informações relevantes.

---

## 🔎 Visão geral

O projeto tem duas partes principais:

- `backend/` — API em Node.js (Express) que fornece endpoints para obras e demandas.
- `frontend/` — Aplicação React (Vite) com mapa (Leaflet), formulário de novas demandas e listagem.

Funcionalidades principais:

- 🗺️ Listagem de obras públicas no mapa (Leaflet).
- 📝 Criação de demandas comunitárias (opcional com localização geográfica).
- 🌙 Alternância entre tema claro e escuro (persistido em localStorage).
- ❌ Remoção da localização associada a uma demanda.

---

## ⚙️ Pré-requisitos

- Node.js (recomendado 18+)
- NPM ou Yarn
- PostgreSQL (o backend usa Postgres via variáveis de ambiente)

---

## 🛠️ Configuração do backend

1. Crie um arquivo `.env` dentro de `backend/` com as variáveis:

```env
DB_USER=seu_usuario
DB_HOST=localhost
DB_NAME=seu_banco
DB_PASS=sua_senha
DB_PORT=5432
PORT=5000
```

2. Instale dependências e inicie o servidor (PowerShell):

```powershell
cd backend
npm install
npm run dev    # usa nodemon; ou npm start
```

> ❗ Observação: o projeto NÃO cria automaticamente as tabelas no banco (o script de init foi removido). Crie a tabela `demandas` manualmente ou use sua ferramenta de migração favorita.

O BANCO DE DADOS VAI SER O POSTGRESQL

Exemplo SQL para criar a tabela `demandas`:

```sql
CREATE TABLE demandas (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  bairro TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  usuario_id INTEGER,
  status TEXT DEFAULT 'aberta',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🎨 Configuração do frontend

1. Instale as dependências:

```bash
cd frontend
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

3. Abra [http://localhost:5173](http://localhost:5173) no navegador.

---

## 📊 Estrutura do projeto

```
CleanWork/
├── backend/
│   ├── app.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MapComponent.jsx
│   │   │   ├── DemandasList.jsx
│   │   │   └── DemandaForm.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🚀 Funcionalidades

- **Mapa Interativo**: Visualize obras públicas e demandas no mapa usando Leaflet.
- **Criação de Demandas**: Formulário para submeter novas demandas comunitárias com localização opcional.
- **Listagem de Demandas**: Veja todas as demandas existentes com opções para remover localização.
- **Tema Dinâmico**: Alternância entre modo claro e escuro, com persistência no localStorage.

---

## 📝 API Endpoints

### Demandas
- `GET /api/demandas` - Lista todas as demandas
- `POST /api/demandas` - Cria uma nova demanda
- `PUT /api/demandas/:id` - Atualiza uma demanda
- `DELETE /api/demandas/:id` - Remove uma demanda
- `PATCH /api/demandas/:id/remover-localizacao` - Remove a localização de uma demanda

### Obras
- `GET /api/obras` - Lista todas as obras públicas

---

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js, Express, PostgreSQL
- **Frontend**: React, Vite, Material-UI, Leaflet
- **Mapa**: OpenStreetMap via Leaflet

---

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

---

## 📄 Licença

Este projeto está sob a licença MIT.
