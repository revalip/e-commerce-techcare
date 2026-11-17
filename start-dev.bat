@echo off
title Menjalankan TechCare E-Commerce
echo ========================================================
echo   MENJALANKAN TECHCARE E-COMMERCE (FRONTEND & BACKEND)
echo ========================================================
echo.

echo 1. Memastikan database MySQL 'techcare' siap...
cd /d "%~dp0server"
call npm run seed

echo.
echo 2. Menjalankan Backend API (Port 4000)...
start "TechCare Backend (Port 4000)" cmd /k "cd /d "%~dp0server" && npm run dev"

timeout /t 2 /nobreak >nul

echo.
echo 3. Menjalankan Frontend React (Port 5173)...
start "TechCare Frontend (Port 5173)" cmd /k "cd /d "%~dp0client" && npm run dev"

echo.
echo ========================================================
echo   TechCare berhasil dijalankan!
echo   Frontend : http://localhost:5173
echo   Backend  : http://localhost:4000
echo ========================================================
echo.
pause
