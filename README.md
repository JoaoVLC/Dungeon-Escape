# TDE 2 - Navegação e Layout de Aplicação React

## Objetivo

Projeto simples de uma SPA em React criado para atender ao TDE 2. A aplicação usa React Router, layout reutilizável e componentes.

## Integrantes

- Nome do integrante 1
- Nome do integrante 2
- Nome do integrante 3

## Páginas implementadas

- Home: apresentação da aplicação.
- Sobre: explicação do projeto.
- Lista: lista de páginas usando o componente `Card`.
- Contato: formulário visual de contato.

## Arquitetura

A aplicação é organizada em camadas simples:

- `src/main.jsx`: ponto de entrada do React.
- `src/App.jsx`: renderiza o conjunto de rotas.
- `src/routes/AppRoutes.jsx`: configura o `BrowserRouter`, as páginas e o layout principal.
- `src/components/Layout.jsx`: define a estrutura comum com header, navbar, área de conteúdo e footer.
- `src/components/Navbar.jsx`: menu de navegação da SPA.
- `src/components/Footer.jsx`: rodapé reutilizável.
- `src/components/Card.jsx`: componente reutilizável para os itens da Home e da Lista.
- `src/pages`: telas acessadas pelas rotas.

## Tecnologias

- React
- React Router DOM
- Vite
- JavaScript
- CSS

## Como rodar

```bash
npm install
npm run dev
```

Se o PowerShell bloquear o comando `npm`, use:

```bash
npm.cmd install
npm.cmd run dev
```

Depois, acesse o endereço exibido pelo Vite no terminal.

## Estrutura de pastas

```text
src/
├── components/
│   ├── Card.jsx
│   ├── Footer.jsx
│   ├── Layout.jsx
│   └── Navbar.jsx
├── pages/
│   ├── Contato.jsx
│   ├── Home.jsx
│   ├── Lista.jsx
│   └── Sobre.jsx
├── routes/
│   └── AppRoutes.jsx
├── App.jsx
├── main.jsx
└── styles.css
```

## Como demonstrar a navegação no vídeo

1. Abra a aplicação no navegador.
2. Clique nas opções da navbar: Home, Sobre, Lista e Contato.
3. Mostre que o conteúdo muda sem recarregar a página inteira.
4. Mostre a Lista usando cards e o formulário da página Contato.

## Observações

Esta versão não possui backend, banco de dados, login ou autenticação. O foco do TDE é a base estrutural da SPA: rotas, layout principal e componentes reutilizáveis.
