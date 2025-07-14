@echo off
echo ========================================
echo   The PM Lens 2.0 - Cache Scheduler
echo ========================================
echo.
echo Starting automatic cache cleanup every hour...
echo.
echo This will run in the background and clean caches automatically.
echo Press Ctrl+C to stop the scheduler.
echo.
echo Logs will be saved to: cache-scheduler.log
echo.

npm run cache:scheduler:start

pause 