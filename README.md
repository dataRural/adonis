# DataRural — Plataforma de Datasets da UFRRJ

**DataRural** é a plataforma repositório de dados abertos e restritos de pesquisa da Universidade Federal Rural do Rio de Janeiro (UFRRJ). O sistema é destinado ao compartilhamento, versionamento, gestão de acesso por grupos de pesquisa e catalogação de conjuntos de dados agrícolas, ambientais e acadêmicos.

---

## Funcionalidades Principais

### Gestão e Publicação de Datasets
- **Assistente de Publicação Multi-etapas**: Upload de arquivos CSV com inferência de colunas, validações de qualidade (codificação UTF-8, detecção de linhas vazias, consistência de tipos) e cálculo de nota estimada de usabilidade.
- **Versionamento de Datasets**: Histórico de versões de conjuntos de dados com controle de download por versão.
- **Licenciamento e Citação**: Suporte a licenças abertas (CC BY 4.0, CC BY-SA, CC BY-NC, ODbL, CC0 e licenças personalizadas), geração automática de citação acadêmica e suporte a identificadores DOI.

### Grupos de Pesquisa e Controle de Acesso
- **Grupos de Usuários**: Criação e gestão de grupos de pesquisa com atribuição de papéis hierárquicos (*Dono*, *Admin*, *Editor*, *Visualizador*).
- **Visibilidade Restrita por Grupo**: Associação de datasets privados a grupos de pesquisa, garantindo que apenas membros autorizados tenham permissão de visualização, download ou edição.

### Busca, Catalogação e Visualização
- **Filtro por Áreas do Conhecimento**: Organização dos dados por áreas institucionais (Agronomia, Veterinária, Clima e Meteorologia, Ciências Biológicas, Florestas, Ciências Exatas, entre outras).
- **Painel de Controle (Dashboard)**: Gestão integrada de datasets pessoais e de grupos com filtros por status (*Publicado*, *Em revisão*, *Rascunho*, *Privado*).
- **Pré-visualização Interativa**: Leitura de amostras de dados, esquema de colunas e documentação (README.md) integrada à página do dataset.

---

## Arquitetura e Tecnologias

- **Backend**: [AdonisJS v6](https://adonisjs.com/) (Framework Node.js)
- **Frontend**: [React](https://react.dev/) via [Inertia.js](https://inertiajs.com/)
- **Banco de Dados**: PostgreSQL com [Lucid ORM](https://lucid.adonisjs.com/)
- **Autenticação e Autorização**: AdonisJS Auth, Bouncer Policies e Ally (Social Login)
- **Validação de Dados**: VineJS
- **Armazenamento de Arquivos**: `@jrmc/adonis-attachment`
- **Monorepo e Build**: pnpm Workspaces, TurboRepo, Vite
- **Ambiente de Desenvolvimento**: Docker / Docker Compose (PostgreSQL, pgAdmin, Mailpit)

---

## Pré-requisitos

- **Node.js**: `>=22.0.0`
- **pnpm**: `^10.0.0` (instale globalmente com `npm install -g pnpm`)
- **Docker e Docker Compose**: Para execução do banco de dados e serviços auxiliares.

---

## Instalação e Configuração

### 1. Clonar o Repositório e Instalar Dependências

```bash
git clone git@github.com:dataRural/adonis.git
cd adonis
pnpm install
```

### 2. Configurar Variáveis de Ambiente

Crie o arquivo `.env` para a aplicação web a partir do exemplo fornecido:

```bash
cp apps/web/.env.example apps/web/.env
```

Gere a chave de criptografia da aplicação:

```bash
node apps/web/ace generate:key
```

### 3. Iniciar o Banco de Dados e Serviços Auxiliares

Inicie os contêineres do PostgreSQL, pgAdmin e Mailpit:

```bash
docker compose up -d
```

### 4. Executar Migrações e Seeders

Execute as migrações para criar as tabelas e popule o banco de dados com a carga inicial:

```bash
# Executar migrações
pnpm --filter web exec node ace migration:run

# Executar seeders
pnpm --filter web exec node ace db:seed
```

---

## Execução do Ambiente de Desenvolvimento

Para iniciar o servidor de desenvolvimento (AdonisJS com Vite HMR):

```bash
pnpm run dev
```

Endereços padrão do ambiente local:
- **Aplicação Web**: `http://localhost:3333`
- **Mailpit (Servidor de email local)**: `http://localhost:8025`
- **pgAdmin**: `http://localhost:5050`

---

## Estrutura do Projeto

```text
.
├── apps/
│   └── web/                    # Aplicação principal (AdonisJS + Inertia.js + React)
│       ├── app/
│       │   ├── auth/           # Módulo de Autenticação
│       │   ├── dataset/        # Módulo de Datasets (Controllers, Models, UI, Migrations)
│       │   ├── groups/         # Módulo de Grupos de Usuários e Permissões
│       │   ├── marketing/      # Módulo de Páginas Públicas e Landing Page
│       │   ├── users/          # Módulo de Gestão de Usuários e Perfis
│       │   ├── common/         # Componentes React compartilhados e Design System
│       │   └── core/           # Middlewares, Bouncer Policies e Exceções
│       ├── config/             # Configurações do AdonisJS (database, auth, inertia, etc.)
│       ├── database/           # Seeders e Migrações globais
│       └── start/              # Rotas e inicialização do servidor
├── packages/                   # Pacotes compartilhados (UI, configurações)
├── docker-compose.yaml         # Configuração dos serviços Docker (Postgres, Mailpit, pgAdmin)
├── pnpm-workspace.yaml         # Configuração do Workspace pnpm
└── turbo.json                  # Configuração do TurboRepo
```

---

## Verificação Estática de Tipos

Para executar a verificação estática do TypeScript no projeto:

```bash
pnpm typecheck
```

---

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).