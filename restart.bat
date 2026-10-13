@echo off
setlocal
title Restarting Kounoz Store System...
cd /d "%~dp0"

echo [1/2] Stopping existing servers...
call stop.bat

timeout /t 2 /nobreak >nul

echo [2/2] Starting server...
call start.bat
endlocal
