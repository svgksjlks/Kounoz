@echo off
setlocal
cd /d "%~dp0"

echo Stopping Kounoz Store servers on port 3000 and 5000...

call node scripts/stop-system.js

endlocal
