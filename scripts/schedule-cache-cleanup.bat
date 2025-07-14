@echo off
REM Cache Cleanup Scheduler for The PM Lens 2.0
REM This script runs cache cleanup every hour

echo [%date% %time%] Starting scheduled cache cleanup...

REM Navigate to project directory
cd /d "D:\the-pm-lens-2.0"

REM Run cache cleanup
node scripts/cache-cleanup.cjs

REM Log completion
echo [%date% %time%] Cache cleanup completed.
echo.

REM Optional: Rebuild project (uncomment if needed)
REM node scripts/cache-cleanup.cjs --rebuild

exit /b 0 