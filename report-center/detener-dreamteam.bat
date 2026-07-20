@echo off
REM =============================================================
REM DreamTeam Report Center - Detiene los 3 servicios del proyecto
REM =============================================================
REM Mata los procesos de Node escuchando en los puertos 8080, 5000
REM y 3002 (o cualquier Vite dev server del proyecto).
REM
REM SEGURO: solo mata procesos de los puertos del proyecto.
REM No toca los puertos 3000 ni 3001 (que son de los otros proyectos:
REM tarifario-smart y NUEVA WEB DREAMTEAM).
REM =============================================================

echo.
echo ============================================
echo  DreamTeam Report Center - Deteniendo
echo ============================================
echo.

setlocal enabledelayedexpansion

set PORTS=8080 5000 3002
set FOUND=0

for %%P in (%PORTS%) do (
    echo [Puerto %%P]
    for /f "tokens=5" %%I in ('netstat -ano ^| findstr ":%%P.*LISTENING"') do (
        if not "%%I"=="0" (
            echo   Matando PID %%I...
            taskkill /F /PID %%I >nul 2>&1
            if !errorlevel! equ 0 (
                echo   OK - PID %%I detenido.
                set /a FOUND+=1
            ) else (
                echo   AVISO - No se pudo detener PID %%I.
            )
        )
    )
)

echo.
if %FOUND% gtr 0 (
    echo  Listo. %FOUND% procesos detenidos.
) else (
    echo  No habia procesos del proyecto corriendo.
)
echo.
pause
