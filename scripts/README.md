# Cache Cleanup System - The PM Lens 2.0

This directory contains scripts for automatic cache cleanup to ensure your application always runs with fresh, up-to-date files.

## 🚀 Quick Setup

### Option 1: One-Click Setup (Recommended)
1. **Right-click** on `setup-cache-cleanup.bat` in the project root
2. **Select "Run as administrator"**
3. **Follow the prompts**

### Option 2: Manual Setup
1. **Open PowerShell as Administrator**
2. **Navigate to your project directory**
3. **Run:** `.\scripts\schedule-cache-cleanup.ps1`

## 📁 Files Overview

### `cache-cleanup.js`
- **Main cleanup script** that removes various caches
- **Logs all activities** to `cache-cleanup.log`
- **Can be run manually** or automatically

### `schedule-cache-cleanup.ps1`
- **PowerShell script** to set up Windows Task Scheduler
- **Creates hourly scheduled task**
- **Requires administrator privileges**

### `schedule-cache-cleanup.bat`
- **Batch file** for manual execution
- **Alternative to PowerShell script**
- **Can be used with Task Scheduler**

## 🛠️ Manual Usage

### Run Cache Cleanup Manually
```bash
# Basic cleanup
npm run cache:clean

# Cleanup with rebuild
npm run cache:clean:rebuild

# Direct script execution
node scripts/cache-cleanup.js
```

### What Gets Cleaned
- ✅ **Vite cache** (`node_modules/.vite`)
- ✅ **Build cache** (`dist/` folder)
- ✅ **npm cache** (global npm cache)
- ✅ **Backend cache** (if exists)
- ✅ **Netlify cache** (`.netlify` folder)

## ⏰ Automatic Scheduling

### Windows Task Scheduler
The setup creates a scheduled task that runs every hour:
- **Task Name:** `PM-Lens-Cache-Cleanup`
- **Frequency:** Every 1 hour
- **Runs as:** SYSTEM account
- **Logs:** `cache-cleanup.log`

### Customize Schedule
```powershell
# Run every 2 hours
.\scripts\schedule-cache-cleanup.ps1 -IntervalHours 2

# Run every 30 minutes (0.5 hours)
.\scripts\schedule-cache-cleanup.ps1 -IntervalHours 0.5
```

## 📊 Monitoring

### View Logs
```bash
# View cleanup logs
cat cache-cleanup.log

# Tail logs in real-time
Get-Content cache-cleanup.log -Wait
```

### Check Task Status
```powershell
# View scheduled task
Get-ScheduledTask -TaskName "PM-Lens-Cache-Cleanup"

# Start task manually
Start-ScheduledTask -TaskName "PM-Lens-Cache-Cleanup"

# Stop task
Stop-ScheduledTask -TaskName "PM-Lens-Cache-Cleanup"
```

## 🔧 Troubleshooting

### Common Issues

#### Task Not Running
1. **Check if task exists:**
   ```powershell
   Get-ScheduledTask -TaskName "PM-Lens-Cache-Cleanup"
   ```

2. **Check task history:**
   ```powershell
   Get-ScheduledTaskInfo -TaskName "PM-Lens-Cache-Cleanup"
   ```

3. **Recreate task:**
   ```powershell
   Unregister-ScheduledTask -TaskName "PM-Lens-Cache-Cleanup" -Confirm:$false
   .\scripts\schedule-cache-cleanup.ps1
   ```

#### Permission Issues
- **Run PowerShell as Administrator**
- **Check Node.js installation**
- **Verify project path is correct**

#### Script Errors
- **Check Node.js is installed**
- **Verify project structure**
- **Check log file for errors**

### Log File Location
- **Path:** `D:\the-pm-lens-2.0\cache-cleanup.log`
- **Format:** Timestamped entries
- **Rotation:** Manual (delete old logs as needed)

## 🎯 Benefits

### Why Automatic Cache Cleanup?
- **Prevents stale cache issues**
- **Ensures fresh builds**
- **Reduces debugging time**
- **Maintains optimal performance**
- **Prevents deployment issues**

### Performance Impact
- **Minimal overhead** (runs in background)
- **Quick execution** (usually < 30 seconds)
- **Non-intrusive** (doesn't affect development)
- **Smart cleanup** (only removes necessary caches)

## 🔄 Integration with Development

### During Development
- **Automatic cleanup** runs in background
- **Manual cleanup** available when needed
- **Logs help** identify cache-related issues

### Before Deployment
```bash
# Force cleanup and rebuild
npm run cache:clean:rebuild
```

### CI/CD Integration
```bash
# Add to build pipeline
npm run cache:clean
npm run build
```

## 📝 Configuration

### Environment Variables
No additional environment variables needed.

### Customization
Edit `cache-cleanup.js` to:
- **Add more cache locations**
- **Modify cleanup behavior**
- **Change logging format**
- **Add email notifications**

## 🆘 Support

### Getting Help
1. **Check logs:** `cache-cleanup.log`
2. **Verify setup:** Run manual cleanup
3. **Check permissions:** Ensure admin access
4. **Review documentation:** This README

### Contact
- **Email:** phani.bozzam@gmail.com
- **Project:** The PM Lens 2.0
- **Issue:** Cache cleanup related

---

**Last Updated:** January 2025  
**Version:** 1.0  
**Maintained By:** Development Team 