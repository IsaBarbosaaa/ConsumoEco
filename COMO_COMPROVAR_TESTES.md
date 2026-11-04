# Testes e cobertura — ConsumoEco

1. Envie os arquivos adicionados/alterados deste pacote para o repositorio GitHub (especialmente `.github/workflows/testes.yml`, `backend/pom.xml` e `backend/src/test/...`).
2. Abra GitHub > Actions > "Testes automatizados e cobertura". O workflow executara `mvn -B clean verify` com Java 21.
3. Se a execucao for verde, entre na execucao > Artifacts > `relatorios-testes-backend` e baixe o ZIP dos relatorios.
4. No ZIP de relatorios, abra `site/jacoco/index.html` no navegador. Na linha `Total`, utilize a porcentagem na coluna `Cov.` de `Instructions` (cobertura de instrucoes). Esse eh o numero a preencher na plataforma. **Nao use um valor estimado.**
5. Faca uma captura da execucao verde mostrando o tempo e a conclusao e outra do relatorio HTML com o percentual. Anexe as duas capturas.

## Execucao local

Com Java 21 e Maven instalados: `cd backend && mvn clean verify`.

Os testes incluidos: um teste de inicializacao de contexto Spring/H2 (integracao basica) e sete testes unitarios de controlador com Mockito. Cobertura e sucesso exigem execucao real: nenhum numero foi antecipado.

Caso os testes falhem, abra os logs da execucao e corrija os erros antes de registrar o percentual. Os testes nao substituem testes integrados HTTP completos nem verificacao de seguranca.
