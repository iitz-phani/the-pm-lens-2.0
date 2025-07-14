#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cache cleanup script for The PM Lens 2.0
class CacheCleanup {
  constructor() {
    this.projectRoot = process.cwd();
    this.logFile = path.join(this.projectRoot, 'cache-cleanup.log');
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    
    // Append to log file
    fs.appendFileSync(this.logFile, logMessage + '\n');
  }

  async cleanViteCache() {
    try {
      const viteCachePath = path.join(this.projectRoot, 'node_modules', '.vite');
      if (fs.existsSync(viteCachePath)) {
        fs.rmSync(viteCachePath, { recursive: true, force: true });
        this.log('✅ Vite cache cleared');
      } else {
        this.log('ℹ️  Vite cache not found');
      }
    } catch (error) {
      this.log(`❌ Error clearing Vite cache: ${error.message}`);
    }
  }

  async cleanBuildCache() {
    try {
      const distPath = path.join(this.projectRoot, 'dist');
      if (fs.existsSync(distPath)) {
        fs.rmSync(distPath, { recursive: true, force: true });
        this.log('✅ Build cache (dist) cleared');
      } else {
        this.log('ℹ️  Build cache not found');
      }
    } catch (error) {
      this.log(`❌ Error clearing build cache: ${error.message}`);
    }
  }

  async cleanNodeModulesCache() {
    try {
      const nodeModulesPath = path.join(this.projectRoot, 'node_modules');
      if (fs.existsSync(nodeModulesPath)) {
        // Clean npm cache
        execSync('npm cache clean --force', { stdio: 'pipe' });
        this.log('✅ npm cache cleared');
      }
    } catch (error) {
      this.log(`❌ Error clearing npm cache: ${error.message}`);
    }
  }

  async cleanBackendCache() {
    try {
      const backendPath = path.join(this.projectRoot, 'backend');
      if (fs.existsSync(backendPath)) {
        // Clean any backend-specific caches
        const backendCachePath = path.join(backendPath, 'cache');
        if (fs.existsSync(backendCachePath)) {
          fs.rmSync(backendCachePath, { recursive: true, force: true });
          this.log('✅ Backend cache cleared');
        }
      }
    } catch (error) {
      this.log(`❌ Error clearing backend cache: ${error.message}`);
    }
  }

  async cleanNetlifyCache() {
    try {
      const netlifyPath = path.join(this.projectRoot, '.netlify');
      if (fs.existsSync(netlifyPath)) {
        fs.rmSync(netlifyPath, { recursive: true, force: true });
        this.log('✅ Netlify cache cleared');
      }
    } catch (error) {
      this.log(`❌ Error clearing Netlify cache: ${error.message}`);
    }
  }

  async rebuildProject() {
    try {
      this.log('🔄 Rebuilding project...');
      execSync('npm run build', { stdio: 'pipe' });
      this.log('✅ Project rebuilt successfully');
    } catch (error) {
      this.log(`❌ Error rebuilding project: ${error.message}`);
    }
  }

  async performCleanup() {
    this.log('🚀 Starting automatic cache cleanup...');
    
    await this.cleanViteCache();
    await this.cleanBuildCache();
    await this.cleanNodeModulesCache();
    await this.cleanBackendCache();
    await this.cleanNetlifyCache();
    
    // Optionally rebuild the project
    if (process.argv.includes('--rebuild')) {
      await this.rebuildProject();
    }
    
    this.log('✨ Cache cleanup completed successfully!');
  }
}

// Run the cleanup
const cleanup = new CacheCleanup();
cleanup.performCleanup().catch(error => {
  console.error('❌ Cache cleanup failed:', error);
  process.exit(1);
}); 