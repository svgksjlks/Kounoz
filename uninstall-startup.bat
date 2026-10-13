@echo off
setlocal

set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "SHORTCUT_PATH=%STARTUP_FOLDER%\Kounoz Store AutoStart.lnk"

if exist "%SHORTCUT_PATH%" (
    del /f /q "%SHORTCUT_PATH%"
    echo [OK] Auto-Start disabled successfully.
) else (
    echo [INFO] Auto-Start shortcut was not found in Startup folder.
)

pause
endlocal
