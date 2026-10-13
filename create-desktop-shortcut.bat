@echo off
setlocal
cd /d "%~dp0"

set "DESKTOP_PATH=%USERPROFILE%\Desktop"
set "SHORTCUT_PATH=%DESKTOP_PATH%\Kounoz Store.lnk"
set "TARGET_PATH=%~dp0start-silent.vbs"

powershell -NoProfile -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SHORTCUT_PATH%'); $s.TargetPath = '%TARGET_PATH%'; $s.WorkingDirectory = '%~dp0'; $s.Description = 'Kounoz Luxury Clothing Store'; $s.Save()"

if exist "%SHORTCUT_PATH%" (
    echo [OK] Shortcut created successfully on your Desktop: "%SHORTCUT_PATH%"
) else (
    echo [ERROR] Could not create shortcut.
)
endlocal
