# V.I.T.A. | Dashboard React

Protótipo de interface para o projeto V.I.T.A., desenvolvido com **React**, **Vite** e **React Router**.

## Como executar

1. Instale uma versão LTS do Node.js.
2. Abra esta pasta (`vita-react`) no VS Code.
3. No terminal integrado, execute `npm install`.
4. Execute `npm run dev`.
5. Abra o endereço local exibido pelo Vite no terminal.

Para verificar se o projeto compila para produção, execute `npm run build`.

## Organização do código

```text
src/
├── main.jsx                 # Inicialização do React e CSS global
├── App.jsx                  # Autenticação e rotas de entrada
├── shared.jsx               # Componentes reutilizáveis, dados fictícios e utilitários
├── styles.css               # Estilos da aplicação
├── layout/
│   └── Shell.jsx             # Menu lateral, cabeçalho, rotas internas e modal SOS
└── pages/
    ├── AuthPages.jsx         # Login e cadastro
    ├── DashboardPage.jsx     # Painel principal
    ├── HistoryPage.jsx       # Histórico, filtros e exportação
    ├── ChartsPage.jsx        # Gráficos individuais dos sinais vitais
    ├── ReportsPage.jsx       # Relatórios, alertas, dispositivo e menu de configurações
    ├── SettingsPages.jsx     # Conta, monitoramento, notificações, privacidade e acessibilidade
    └── HelpPage.jsx          # Ajuda e suporte
```

## Onde editar cada coisa

- **Aparência geral:** `src/styles.css`.
- **Menu, cabeçalho e navegação:** `src/layout/Shell.jsx`.
- **Caminhos das páginas e autenticação:** `src/App.jsx`.
- **Uma tela específica:** o arquivo correspondente dentro de `src/pages/`.
- **Componentes reutilizados em várias telas:** `src/shared.jsx`.
- **Dados de exemplo:** constantes `patient`, `readings`, `alerts` e `history` em `src/shared.jsx`.
- **Exportação CSV/PDF:** utilitários `downloadCSV` e `downloadPDF` em `src/shared.jsx`.
- **Preferências guardadas no navegador:** hook `useSaved` em `src/shared.jsx` e telas de configurações em `src/pages/SettingsPages.jsx`.

## Convenções adotadas

- Cada arquivo tem uma responsabilidade principal.
- Componentes compartilhados ficam em `shared.jsx`, evitando duplicação entre telas.
- Comentários identificam o papel dos módulos e utilitários; prefira comentários que expliquem o motivo da lógica, não apenas repitam o nome do código.
- Use nomes descritivos em português quando isso melhorar a compreensão do projeto.
- Ao criar uma nova página, crie um componente em `src/pages/` e registre a rota em `src/layout/Shell.jsx`.

## Funcionalidades do protótipo

- Login e cadastro demonstrativos.
- Painel individual, histórico, gráficos, relatórios, alertas e informações do dispositivo.
- Configurações de conta, intervalo ou quantidade de medições, notificações, contatos de emergência e acessibilidade.
- Tema claro, escuro e conforme o sistema; tamanho da fonte, alto contraste, redução de movimento e foco visível.
- Histórico exportável em CSV e relatórios exportáveis em PDF.
- Preferências e dados de perfil armazenados no `localStorage` do navegador.

## Limitações importantes

Este projeto é um **protótipo frontend**. Os sinais vitais, o status do aparelho e os alertas são dados ilustrativos. Ainda não há integração com ESP32, sensores, API ou banco de dados. O login local não é uma solução de segurança para uso real, e os limites de sinais vitais precisam de validação profissional.


## Correção 1.5.1: carregamento da autenticação

- A área autenticada agora é carregada sob demanda, separada das páginas de login e cadastro.
- A tela de autenticação importa apenas os componentes e utilitários de que realmente precisa.
- Foi adicionada uma proteção de erro para evitar uma tela totalmente em branco caso uma página interna falhe.


## Versão 1.5.2 — correções de autenticação

- O campo de e-mail do login começa vazio; o endereço da conta não é preenchido automaticamente.
- Após cadastrar, a sessão não é iniciada automaticamente. O sistema confirma o cadastro e encaminha para o login.
- As páginas internas são carregadas sob demanda, reduzindo o risco de um erro em uma página secundária impedir a abertura do painel.
- Se ocorrer um erro de renderização na área autenticada, a sessão local demonstrativa é limpa para permitir retornar ao login.

**Limitação:** a autenticação ainda é demonstrativa e utiliza `localStorage` no navegador. Não há servidor de autenticação, recuperação de senha ou sincronização entre navegadores.
