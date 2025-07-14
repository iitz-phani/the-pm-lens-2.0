@echo off
echo ========================================
echo   The PM Lens 2.0 - Cache Cleanup Setup
echo ========================================
echo.

echo This will set up automatic cache cleanup every hour.
echo.
echo Requirements:
echo - Windows 10/11
echo - Node.js installed
echo - Administrator privileges
echo.

pause

echo.
echo Setting up automatic cache cleanup...
echo.

REM Run PowerShell script as administrator
powershell -ExecutionPolicy Bypass -File "scripts\schedule-cache-cleanup.ps1"

echo.
echo Setup complete! Press any key to exit.
pause > nul 