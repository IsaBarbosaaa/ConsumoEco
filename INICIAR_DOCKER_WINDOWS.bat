@echo off
cd /d "%~dp0"
where docker >nul 2>nul
if errorlevel 1 (
 echo Docker nao encontrado. Instale o Docker Desktop ou abra a previa local.
 pause
 exit /b 1
)
if not exist .env copy .env.example .env >nul
docker compose up --build -d
if errorlevel 1 (
 echo Erro ao iniciar o projeto. Verifique o Docker Desktop.
 pause
 exit /b 1
)
echo Aplicacao iniciada. Abra http://localhost:8088
start "" "http://localhost:8088"
pause
