#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class CacheScheduler {
  constructor() {
    this.projectRoot = process.cwd();
    this.logFile = path.join(this.projectRoot, 'cache-scheduler.log');
    this.intervalHours = 1; // Run every hour
    this.isRunning = false;
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    
    // Append to log file
    fs.appendFileSync(this.logFile, logMessage + '\n');
  }

  async runCacheCleanup() {
    if (this.isRunning) {
      this.log('⚠️  Cache cleanup already running, skipping...');
      return;
    }

    this.isRunning = true;
    this.log('🚀 Starting scheduled cache cleanup...');

    try {
      // Run the cache cleanup script
      const cleanupScript = path.join(this.projectRoot, 'scripts', 'cache-cleanup.cjs');
      
      const child = spawn('node', [cleanupScript], {
        cwd: this.projectRoot,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      child.stdout.on('data', (data) => {
        const output = data.toString().trim();
        if (output) {
          this.log(`📝 ${output}`);
        }
      });

      child.stderr.on('data', (data) => {
        const error = data.toString().trim();
        if (error) {
          this.log(`❌ ${error}`);
        }
      });

      child.on('close', (code) => {
        if (code === 0) {
          this.log('✅ Cache cleanup completed successfully');
        } else {
          this.log(`❌ Cache cleanup failed with code ${code}`);
        }
        this.isRunning = false;
      });

    } catch (error) {
      this.log(`❌ Error running cache cleanup: ${error.message}`);
      this.isRunning = false;
    }
  }

  startScheduler() {
    this.log('🎯 Starting cache cleanup scheduler...');
    this.log(`⏰ Will run every ${this.intervalHours} hour(s)`);
    this.log(`📝 Logs will be saved to: ${this.logFile}`);
    this.log('🔄 Press Ctrl+C to stop the scheduler');
    this.log('');

    // Run immediately on start
    this.runCacheCleanup();

    // Schedule to run every hour
    const intervalMs = this.intervalHours * 60 * 60 * 1000; // Convert hours to milliseconds
    
    setInterval(() => {
      this.runCacheCleanup();
    }, intervalMs);

    // Keep the process alive
    process.on('SIGINT', () => {
      this.log('🛑 Stopping cache cleanup scheduler...');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      this.log('🛑 Stopping cache cleanup scheduler...');
      process.exit(0);
    });
  }

  showStatus() {
    this.log('📊 Cache Scheduler Status:');
    this.log(`   Running: ${this.isRunning ? 'Yes' : 'No'}`);
    this.log(`   Interval: ${this.intervalHours} hour(s)`);
    this.log(`   Log file: ${this.logFile}`);
    this.log(`   Project: ${this.projectRoot}`);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const scheduler = new CacheScheduler();

if (args.includes('--status')) {
  scheduler.showStatus();
} else if (args.includes('--interval')) {
  const intervalIndex = args.indexOf('--interval');
  if (intervalIndex + 1 < args.length) {
    const interval = parseFloat(args[intervalIndex + 1]);
    if (interval > 0) {
      scheduler.intervalHours = interval;
    }
  }
  scheduler.startScheduler();
} else {
  // Default: start scheduler with 1-hour interval
  scheduler.startScheduler();
} 