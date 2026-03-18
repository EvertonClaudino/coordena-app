## ESTRUTURA DO PROJETO:


coordena-app/
├─ app/
│  ├─ api/
│  │  ├─ auth/
│  │  │  └─ [...nextauth]/
│  │  │      └─ route.ts
│  │  ├─ cursos/
│  │  │  └─ route.ts              ✅ NOVO — GET listar / POST criar cursos
│  │  └─ formadores/
│  │      └─ route.ts
│  │
│  ├─ dashboard/
│  │  └─ components/
│  │      ├─ coordenador-dashboard.tsx
│  │      ├─ formador-dashboard.tsx
│  │      └─ formando-dashboard.tsx
│  │
│  ├─ data/
│  │  ├─ coordenador.ts
│  │  ├─ documentos.ts
│  │  ├─ formador.ts
│  │  ├─ formadores.ts
│  │  └─ formando.ts
│  │
│  ├─ assiduidade/
│  │    └─ page.tsx
│  ├─ calendario/
│  │    └─ page.tsx
│  ├─ convites/
│  │    └─ page.tsx
│  ├─ cursos/
│  │    └─ page.tsx                 ✅ ATUALIZADO — dados reais da BD
│  ├─ disponibilidades/
│  │    └─ page.tsx
│  ├─ documentos/
│  │    └─ page.tsx
│  ├─ formadores/
│  │    └─ page.tsx
│  ├─ formandos/
│  │    └─ page.tsx
│  ├─ meus-cursos/
│  │    └─ page.tsx
│  ├─ meus-cursos-formando/
│  │    └─ page.tsx
│  ├─ modulos/
│  │    └─ page.tsx
│  ├─ modulos-atribuidos/
│  │    └─ page.tsx
│  ├─ notas/
│  │    └─ page.tsx
│  └─ perfil/
│       └─ page.tsx
│
├─ login/
│  └─ [role]/
│       └─ page.tsx
│
├─ components/
│  ├─ ui/
│  │   ├─ alert-dialog.tsx
│  │   ├─ avatar.tsx
│  │   ├─ button.tsx
│  │   ├─ dialog.tsx
│  │   ├─ dropdown-menu.tsx
│  │   ├─ input.tsx
│  │   ├─ label.tsx
│  │   ├─ progress.tsx
│  │   └─ textarea.tsx
│  ├─ app-sidebar.tsx
│  └─ topbar.tsx
│
├─ lib/
│  ├─ documento-utils.ts
│  ├─ prisma.ts
│  └─ utils.ts
│
├─ prisma/
│  ├─ schema.prisma
│  └─ prisma.config.ts
│
├─ .env
├─ package.json
└─ tsconfig.json