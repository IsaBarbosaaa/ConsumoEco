# ConsumoEco

Plataforma de consumo consciente para a comunidade do Condomínio Vila Alpina. MVP acadêmico com cadastro e autenticação, registro mensal de água/energia, painel de gráficos, calculadora de economia e dicas sustentáveis.

## Como abrir uma prévia imediatamente (sem instalar nada)

Abra `demo/abrir-no-navegador.html` no Chrome ou Edge. Clique em **Explorar demonstração sem cadastro** (a tela da prévia usa a expressão **Explorar demonstração**).

A prévia é um arquivo HTML local e funciona sem backend, sem PostgreSQL e sem internet. É um protótipo demonstrativo, não substitui o sistema integrado. Os registros dessa prévia são mantidos **apenas durante a sessão atual da página**, não em banco de dados.

## Executar a aplicação completa (método mais simples)

Requisitos: Docker Desktop com Docker Compose (Windows/macOS/Linux), ao menos 4 GB de RAM livres e acesso à internet para baixar as imagens e dependências na primeira execução.

1. Descompacte o projeto.
2. No terminal, dentro da pasta `ConsumoEco`, execute:

   ```bash
   cp .env.example .env
   docker compose up --build -d
   ```

   No Windows PowerShell, substitua `cp` por `Copy-Item .env.example .env`.
3. Abra **http://localhost:8088**.
4. Selecione **Criar conta**, cadastre um nome, e-mail e senha (mínimo 10 caracteres), faça login e registre seus consumos.
5. Para encerrar, execute `docker compose down`. Para excluir também os dados do banco, `docker compose down -v` (ação irreversível).

> O banco PostgreSQL é persistido no volume `postgres_data`. A porta externa do site pode ser alterada por `WEB_PORT` no arquivo `.env`.

## Rodar sem Docker: PostgreSQL + Java + Node

Requisitos: Java JDK 21, Maven 3.9+, Node 22+, PostgreSQL 16+.

1. Crie o banco `consumoeco`, o usuário `consumoeco`, configure sua senha e dê acesso ao banco. Consulte `.env.example` e `backend/src/main/resources/application.yml`.
2. No terminal 1:
   ```bash
   cd backend
   # Linux / macOS:
   export DATABASE_URL='jdbc:postgresql://localhost:5432/consumoeco'
   export DATABASE_USER='consumoeco'
   export DATABASE_PASSWORD='sua_senha'
   mvn spring-boot:run
   ```
   Em PowerShell: `$env:DATABASE_PASSWORD = 'sua_senha'` e ajuste as demais variáveis da mesma forma.
3. No terminal 2:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. Abra **http://localhost:5173**.

### Teste simplificado do backend com banco H2 local

Se não houver PostgreSQL instalado, execute o backend com `mvn spring-boot:run -Dspring-boot.run.profiles=demo` dentro de `backend`. O perfil `demo` usa H2 em arquivo no lugar do PostgreSQL para desenvolvimento local. O frontend continua em `npm run dev`.

## Telas

- **Tela 1:** entrada, cadastro de conta e login.
- **Tela 2:** registro mensal com mês, m³ de água, custo da água, kWh de energia e custo da energia.
- **Tela 3:** dashboard, histórico, variações percentuais, gráficos e calculadora de economia.
- **Complementar:** seção de dicas sustentáveis.

## Pilha técnica

- Frontend: React 19, Vite 7, Recharts 3, lucide-react, CSS responsivo.
- Backend: Java 21, Spring Boot 3.5.16, Spring Security, Spring Data JPA, Hibernate, Jakarta Validation.
- Persistência: PostgreSQL 16 com H2 opcional para testes locais.
- Implantação: Docker Compose, Nginx como proxy reverso, configuração por variáveis de ambiente.

## Rotas de API

| Método | Endpoint | Função |
|---|---|---|
| GET | `/api/health` | Verificação simples |
| GET | `/api/auth/csrf` | Token CSRF |
| POST | `/api/auth/register` | Cadastro |
| POST | `/api/auth/login` | Login por sessão |
| POST | `/api/auth/logout` | Encerramento da sessão |
| GET | `/api/auth/me` | Dados do usuário atual |
| GET | `/api/consumptions` | Histórico do usuário |
| POST | `/api/consumptions` | Cadastrar mês |
| PUT | `/api/consumptions/{id}` | Editar mês |
| DELETE | `/api/consumptions/{id}` | Excluir mês |
| GET | `/api/content` | Dicas educativas |

## Segurança e privacidade

- Senhas armazenadas com BCrypt; nunca em texto simples.
- Sessões com cookie HttpOnly e proteção CSRF.
- Consultas de histórico filtradas pelo usuário autenticado no servidor.
- Verificações de campos com Jakarta Validation e acesso ao banco via Spring Data JPA.
- A interface de demonstração **não envia dados a um servidor**.
- O projeto não armazena CPF, telefone ou endereço residencial.

**Importante para publicar na internet:** o projeto é um MVP educacional. Antes de publicar em ambiente público, habilite HTTPS, defina `COOKIE_SECURE=true`, configure domínio, segredos fortes, um banco com backup, migrações versionadas, política de privacidade e consentimento quando aplicável, limitação de tentativas de login, observabilidade e atualização de dependências. `ddl-auto=update` é adequado apenas ao ambiente inicial de desenvolvimento. A versão 3.5.x do Spring Boot já encerrou o suporte OSS; planeje uma atualização para uma linha suportada e teste a compatibilidade antes de produção.

## Validar

- `mvn test` na pasta `backend`, com JDK 21 e Maven instalados.
- `npm run build` na pasta `frontend`, após `npm install`.
- Testar manualmente criação de conta, login, registro, duplicidade por mês, atualização, exclusão, consulta entre contas diferentes, calculadora e logout.
- `docker compose logs -f` para investigar problemas de inicialização.

## Publicar no GitHub

Não adicione o arquivo `.env` ao repositório (já está no `.gitignore`). Na pasta raiz:

```bash
git init
git add .
git commit -m "feat: MVP ConsumoEco"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/consumoeco.git
git push -u origin main
```

Crie um repositório vazio no GitHub antes de executar os comandos. Substitua `SEU-USUARIO` pelo seu usuário, sem copiar arquivos com senhas reais.

## Limites do MVP

Sem integração com concessionárias, sem IoT, sem cobrança, sem inteligência artificial e sem dados reais pré-carregados. A calculadora usa estimativas proporcionais; a conta real pode diferir conforme tarifa e impostos.

## Licença

MIT (veja `LICENSE`).
