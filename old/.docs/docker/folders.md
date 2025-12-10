```
/project-root
│
├── src
│   ├── index.ts                # começa tudo aqui
│   ├── routes/                 # Importa todas as rotas
│   │   ├── index.ts            # Registra todas as versões
│   │   ├── v_/                 # Versão base
│   │   ├── v1/
│   │   │   └── users.routes.ts
│   │   │   └── products.routes.ts
│   │   └── v2/
│   │       └── users.routes.ts
│   │       └── products.routes.ts
│   ├── controllers/                      # Lógica de cada rota
│   │   ├── v1/
│   │   │   └── users.controller.ts
│   │   │   └── products.controller.ts
│   │   └── v2/
│   │       └── users.controller.ts
│   │       └── products.controller.ts
│   ├── services/                         # Regras de negócio e integração com DB ou APIs
│   │   ├── users.service.ts
│   │   └── products.service.ts
│   ├── models/                           # Modelos de dados (ORM/DB)
│   │   └── user.model.ts
│   │   └── product.model.ts
│   ├── plugins/                          # Plugins koa (ex: JWT, CORS, DB)
│   │   └── koaServer.plugins.ts          # Configuração do Koa Server
│   │   └── db.plugin.ts
│   │   └── auth.plugin.ts
│   └── schemas/                          # Schemas de validação (ajuda koa a ser rápido)
│   │   └── user.schema.ts
│   │   └── product.schema.ts
│   └── utils/                   # Funções utilitárias
│       └── logger.ts
│
├── tests/                       # Testes unitários e de integração
├── package.json
├── tsconfig.json
└── .env
```
