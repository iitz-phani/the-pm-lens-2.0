# Cache Cleanup Scheduler for The PM Lens 2.0
# PowerShell script to set up automatic hourly cache cleanup

param(
    [string]$ProjectPath = "D:\the-pm-lens-2.0",
    [string]$TaskName = "PM-Lens-Cache-Cleanup",
    [int]$IntervalHours = 1
)

Write-Host "🚀 Setting up automatic cache cleanup every $IntervalHours hour(s)..." -ForegroundColor Green

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script requires administrator privileges to create scheduled tasks." -ForegroundColor Red
    Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
    exit 1
}

# Create the action (what to run)
$Action = New-ScheduledTaskAction -Execute "node.exe" -Argument "scripts/cache-cleanup.cjs" -WorkingDirectory $ProjectPath

# Create the trigger (when to run - every hour)
$Trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Hours $IntervalHours) -RepetitionDuration (New-TimeSpan -Days 365)

# Create the settings
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RunOnlyIfNetworkAvailable

# Create the principal (who runs it)
$Principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest

# Create the task
try {
    Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Settings $Settings -Principal $Principal -Description "Automatic cache cleanup for The PM Lens 2.0"
    Write-Host "✅ Scheduled task '$TaskName' created successfully!" -ForegroundColor Green
    Write-Host "📅 Task will run every $IntervalHours hour(s) starting from now." -ForegroundColor Cyan
    
    # Show task details
    Write-Host "`n📋 Task Details:" -ForegroundColor Yellow
    Get-ScheduledTask -TaskName $TaskName | Format-List Name, State, LastRunTime, NextRunTime
    
} catch {
    Write-Host "❌ Error creating scheduled task: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 Setup complete! Cache cleanup will run automatically every $IntervalHours hour(s)." -ForegroundColor Green
Write-Host "📝 Logs will be saved to: $ProjectPath\cache-cleanup.log" -ForegroundColor Cyan

# Optional: Test the script
Write-Host "`n🧪 Testing cache cleanup script..." -ForegroundColor Yellow
try {
    Set-Location $ProjectPath
    node scripts/cache-cleanup.cjs
    Write-Host "✅ Test run completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Test run failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n📚 Useful commands:" -ForegroundColor Yellow
Write-Host "  • View task: Get-ScheduledTask -TaskName '$TaskName'" -ForegroundColor White
Write-Host "  • Start task: Start-ScheduledTask -TaskName '$TaskName'" -ForegroundColor White
Write-Host "  • Stop task: Stop-ScheduledTask -TaskName '$TaskName'" -ForegroundColor White
Write-Host "  • Delete task: Unregister-ScheduledTask -TaskName '$TaskName' -Confirm:$false" -ForegroundColor White 