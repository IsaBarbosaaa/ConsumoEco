# Verificações realizadas no pacote

- Arquivos criados para frontend, backend, PostgreSQL, Docker Compose, prévia HTML e documentação.
- Java 21 e Node 22 presentes no ambiente de geração.
- Sintaxe JavaScript checada com `node --check` para `frontend/src/api.js`, `frontend/vite.config.js` e JavaScript da prévia HTML (sem erros de sintaxe).
- Prévia HTML autossuficiente, sem dependências externas de bibliotecas.

## Verificações pendentes no computador do usuário

Este ambiente de geração não possui Maven nem Docker e não consegue acessar os repositórios externos para baixar as dependências. Portanto, **não foi possível compilar o projeto React/Spring Boot, executar testes Java nem iniciar os contêineres aqui**. O ZIP entrega o código completo e as instruções, mas a primeira execução integrada precisa ser confirmada localmente.

Após instalar Docker Desktop e iniciar a aplicação:

1. `docker compose up --build -d`
2. Abra `http://localhost:8088`.
3. Cadastre um usuário; entre e registre um mês.
4. Confirme duplicidade para mesmo usuário e mês, edição, exclusão, gráficos e calculadora.
5. Crie um segundo usuário e confirme que ele não acessa registros do primeiro.
6. Teste logout e retorno à tela de login.
7. Faça testes de teclado, contraste e responsividade.

A prévia é útil para apresentar o fluxo mesmo sem Docker; não equivale a testes do backend.
