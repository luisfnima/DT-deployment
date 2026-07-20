@echo off
REM =============================================================
REM DreamTeam Report Center - Levanta los 3 servicios del proyecto
REM =============================================================
REM Servicios:
REM   1. Evolution API (puerto 8080) - WhatsApp gateway
REM   2. Backend       (puerto 5000) - API + scheduler
REM   3. Frontend      (puerto 3002) - Interfaz Vite
REM
REM Cada servicio se abre en su propia ventana CMD con titulo
REM identificable. Para detener todo, cierra cada ventana con Ctrl+C
REM o cierra la ventana directamente.
REM =============================================================

set ROOT=%~dp0
set EVOLUTION_DIR=%ROOT%..\evolution-api

echo.
echo ============================================
echo  DreamTeam Report Center - Arranque
echo ============================================
echo.
echo  Evolution API: %EVOLUTION_DIR%
echo  Backend:       %ROOT%backend
echo  Frontend:      %ROOT%frontend
echo.
echo  Abriendo 3 ventanas...
echo.

REM --- 1. Evolution API (puerto 8080) ---
start "DreamTeam - Evolution API [8080]" cmd /k "cd /d ""%EVOLUTION_DIR%"" && echo [Evolution] Iniciando... && npm run start:prod"

REM Pequeña espera para que Evolution arranque primero y libere el puerto
timeout /t 2 /nobreak >nul

REM --- 2. Backend (puerto 5000) ---
start "DreamTeam - Backend [5000]" cmd /k "cd /d ""%ROOT%backend"" && echo [Backend] Iniciando... && npm run dev"

REM --- 3. Frontend (puerto 3002) ---
start "DreamTeam - Frontend [3002]" cmd /k "cd /d ""%ROOT%frontend"" && echo [Frontend] Iniciando... && npm run dev"

echo.
echo  Las 3 ventanas se abrieron. Verifica en cada una que
echo  no haya errores. La app estara lista cuando veas:
echo.
echo    [8080] Evolution: "Server started on http://localhost:8080"
echo    [5000] Backend:   "Server running on port 5000"
echo    [3002] Frontend:  "Local: http://localhost:3002/"
echo.
echo  Para detener: cierra cada ventana o Ctrl+C en cada una.
echo.
pause
