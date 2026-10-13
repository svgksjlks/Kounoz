@echo off
setlocal
cd /d "%~dp0"

echo Enabling Auto-Start on Windows Boot for Kounoz Store...

set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "SHORTCUT_PATH=%STARTUP_FOLDER%\Kounoz Store AutoStart.lnk"
set "TARGET_PATH=%~dp0start-silent.vbs"

powershell -NoProfile -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SHORTCUT_PATH%'); $s.TargetPath = '%TARGET_PATH%'; $s.WorkingDirectory = '%~dp0'; $s.Description = 'Kounoz Store Background Service'; $s.Save()"

if exist "%SHORTCUT_PATH%" (
    echo [OK] Auto-Start enabled successfully!
    echo Kounoz Store will now start in the background whenever Windows starts.
) else (
    echo [ERROR] Failed to create shortcut in Startup folder.
)

pause
endlocal
