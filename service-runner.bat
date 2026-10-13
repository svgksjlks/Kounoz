@echo off
setlocal
cd /d "%~dp0"

call node scripts/start-system.js --no-browser

endlocal
