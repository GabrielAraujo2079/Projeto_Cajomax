# 🎪 Projeto CajoMax
> Site de eventos desenvolvido como projeto acadêmico no SENAC.

### 👥 Membros
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
│   │   ├── login.html
│   │   └── dashboard.html
│   │
│   ├── /css               ← estilos
│   │   ├── global.css     ← reset + variáveis + tema
│   │   ├── layout.css     ← estrutura (header, container)
│   │   └── components.css ← botões, cards, inputs
│   │
│   ├── /js                ← scripts do front
│   │   ├── main.js        ← eventos e DOM
│   │   └── api.js         ← comunicação com Node (fetch)
│   │
│   └── /assets            ← arquivos estáticos
│       ├── /images
│       ├── /icons
│       └── /fonts
│
├── /src                   ← BACKEND (Node)
│
├── server.js              ← inicia o servidor
└── package.json
```

---

## ⚙️ Como rodar o projeto

```bash
# Instalar dependências
npm install

# Rodar o servidor
node server.js
```

---

## 🔧 Configuração do banco de dados

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DB_HOST=IP_DO_SERVIDOR\BDSENAC
DB_PORT=1433
DB_NAME=nome_do_banco
DB_USER=senaclivre
DB_PASS=sua_senha
```

> ⚠️ **Nunca suba o `.env` para o repositório.** Ele já está no `.gitignore`.

---

## 🗄️ Esquema SQL Server

### Tabela `Usuarios`

```sql
CREATE TABLE Usuarios (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nome NVARCHAR(100) NOT NULL,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    SenhaHash NVARCHAR(255) NOT NULL,
    TipoUsuario NVARCHAR(20) NOT NULL DEFAULT 'comum'
        CHECK (TipoUsuario IN ('comum', 'admin')),
    DataCriacao DATETIME NOT NULL DEFAULT GETDATE()
);
```

### Tabela `Eventos`

```sql
CREATE TABLE Eventos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Titulo NVARCHAR(200) NOT NULL,
    Descricao NVARCHAR(800) NOT NULL,
    DataEvento DATETIME NOT NULL,
    UsuarioId INT NOT NULL,
    DataCriacao DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Eventos_Usuarios FOREIGN KEY (UsuarioId)
        REFERENCES Usuarios(Id)
        ON DELETE CASCADE
);
```

> 💡 No GitHub, blocos de código `sql` já ganham botão de copiar automaticamente no canto superior direito.

---

## 📐 Arquitetura

O projeto segue estrutura **MVC** mesmo operando como API cliente-servidor:

- **Model** → lógica de banco de dados (`/src`)
- **View** → páginas HTML (`/public`)
- **Controller** → rotas e regras de negócio (`/src`)

---

## ✅ Boas práticas

- Evitar `git push --force` _(ressalva especial ao Marcos e Nycollas 👀)_
- **Comentar o código. Sem exceção.**
- Uso de IA de forma didática parcialmente liberado
- Estrutura sempre em MVC
- Este README é informal até o dia da entrega — depois vira um mais sério

---

## 📝 Observações do banco

- `SenhaHash` armazena o hash da senha, nunca texto puro
- `UNIQUE` em `Email` evita duplicidade de cadastro
- `ON DELETE CASCADE` garante integridade referencial automática
- `TipoUsuario` com `CHECK` já impede valores inválidos
- `DataCriacao` com `GETDATE()` é preenchida automaticamente
