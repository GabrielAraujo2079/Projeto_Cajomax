# Projeto CajoMax
> Site de eventos desenvolvido como projeto integrador no SENAC.

### Membros
Otto · Gabriel Araujo · Pablo · Felipe · Enzo · Matheus · Marcos · Samuel · Nycollas

---

## 📂 Estrutura de Pastas

```
/Projeto_Cajomax
│
├── /public                ← FRONT (o navegador vê)
│   │
│   ├── index.html         ← entrada principal
│   │
│   ├── /pages             ← outras telas
│   │   ├── adulto.html
│   │   ├── config.html
│   │   ├── infantil.html
│   │   ├── maioridade.html
│   │   ├── sobre.html
│   │   └── suporte.html
│   │
│   ├── /css               ← estilos
│   │   ├── global.css
│   │   ├── index.css
│   │   ├── login.css
│   │   ├── sobre.css
│   │   └── suporte.css
│   │
│   ├── /js                ← scripts do front
│   │   └── script.js
│   │
│   └── /assets            ← arquivos estáticos
│       ├── /icons
│       └── /imagem
│
├── .env.example
├── server.js              ← inicia o servidor
├── package.json
└── README.md
```

---

## Como rodar o projeto

```bash
# Instalar dependências
npm install

# Rodar o servidor
node server.js
```

---

## O que foi identificado
- O backend de eventos ainda não está implementado.
- `src/routes/eventosRoutes.js` e `src/controllers/eventosController.js` tão vazios.
- `src/middleware/auth.js` ta vazio.
- `server.js` carrega `eventosRoutes`, então o servidor falha pq ta vazio.

---

## Configuração do banco de dados

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DB_HOST=IP_DO_SERVIDOR\BDSENAC
DB_PORT=1433
DB_NAME=nome_do_banco
DB_USER=senaclivre
DB_PASS=sua_senha
```

> **Nunca suba o `.env` para o repositório.** Ele já está no `.gitignore`.

---

## Esquema SQL Server
```
-- ========================================
-- CAJOMAX - Script de criação do banco
-- ========================================
CREATE DATABASE Cajomax;
GO
USE Cajomax;
GO
CREATE TABLE Usuarios (
    Id           INT           IDENTITY(1,1) PRIMARY KEY,
    Nome         NVARCHAR(100) NOT NULL,
    Email        NVARCHAR(150) NOT NULL UNIQUE,
    SenhaHash    NVARCHAR(255) NOT NULL,
    Idade        INT           NOT NULL CHECK (Idade >= 0),
    Telefone     NVARCHAR(20)  NOT NULL,
    Genero       NVARCHAR(20)  NOT NULL CHECK (Genero IN ('Masculino', 'Feminino', 'Outro')),
    TipoUsuario  NVARCHAR(20)  NOT NULL DEFAULT 'comum' CHECK (TipoUsuario IN ('comum', 'admin')),
    DataCriacao  DATETIME      NOT NULL DEFAULT GETDATE()
);
GO

CREATE TABLE Eventos (
    Id           INT           IDENTITY(1,1) PRIMARY KEY,
    UsuarioId    INT           NOT NULL,
    Titulo       NVARCHAR(200) NOT NULL,
    Descricao    NVARCHAR(800) NOT NULL,
    DataEvento   DATE          NOT NULL,
    HorarioEvento TIME         NOT NULL,
    ImagemPath   NVARCHAR(500) NULL,
    -- Público alvo
    IdadeMinima  INT           NOT NULL DEFAULT 0,
    IdadeMaxima  INT           NOT NULL DEFAULT 120,
    GeneroAlvo   NVARCHAR(20)  NOT NULL DEFAULT 'Todos' CHECK (GeneroAlvo IN ('Masculino', 'Feminino', 'Todos')),
    -- Endereço (preenchido via API de CEP)
    CEP          CHAR(8)       NOT NULL,
    Rua          NVARCHAR(200) NOT NULL,
    Numero       NVARCHAR(20)  NOT NULL,
    Complemento  NVARCHAR(100) NULL,
    Bairro       NVARCHAR(100) NOT NULL,
    Cidade       NVARCHAR(100) NOT NULL,
    Estado       CHAR(2)       NOT NULL,
    DataCriacao  DATETIME      NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Eventos_Usuarios FOREIGN KEY (UsuarioId)
        REFERENCES Usuarios(Id) ON DELETE CASCADE,
    CONSTRAINT CK_IdadeMinMax CHECK (IdadeMinima <= IdadeMaxima)
);
GO

CREATE TABLE TicketsSuporte (
    Id             INT           IDENTITY(1,1) PRIMARY KEY,
    UsuarioId      INT           NOT NULL,
    Assunto        NVARCHAR(200) NOT NULL,
    Mensagem       NVARCHAR(2000) NOT NULL,
    Status         NVARCHAR(20)  NOT NULL DEFAULT 'aberto' CHECK (Status IN ('aberto', 'em_andamento', 'fechado')),
    DataAbertura   DATETIME      NOT NULL DEFAULT GETDATE(),
    DataFechamento DATETIME      NULL,
    CONSTRAINT FK_Tickets_Usuarios FOREIGN KEY (UsuarioId)
        REFERENCES Usuarios(Id) ON DELETE CASCADE
);
GO
```
---

## Arquitetura

O projeto segue estrutura **MVC** mesmo operando como API cliente-servidor:

- **Model** → lógica de banco de dados (`/src`)
- **View** → páginas HTML (`/public`)
- **Controller** → rotas e regras de negócio (`/src`)

---

## Boas práticas

- Evitar `git push --force` _(ressalva especial ao Marcos e Nycollas)_
- **Comentar o código. Sem exceção.**
- Uso de IA de forma didática parcialmente liberado
- Estrutura sempre em MVC
- Este README é informal até o dia da entrega — depois vira um mais sério

---

## Observações do banco

- `SenhaHash` armazena o hash da senha, nunca texto puro
- `UNIQUE` em `Email` evita duplicidade de cadastro
- `ON DELETE CASCADE` garante integridade referencial automática
- `TipoUsuario` com `CHECK` já impede valores inválidos
- `DataCriacao` com `GETDATE()` é preenchida automaticamente
