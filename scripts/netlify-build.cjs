#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class NetlifyBuild {
  constructor() {
    this.projectRoot = process.cwd();
    this.logFile = path.join(this.projectRoot, 'netlify-build.log');
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    
    // Append to log file
    fs.appendFileSync(this.logFile, logMessage + '\n');
  }

  async cleanBuildCache() {
    try {
      this.log('🧹 Cleaning build cache for Netlify...');
      
      // Clean dist folder
      const distPath = path.join(this.projectRoot, 'dist');
      if (fs.existsSync(distPath)) {
        fs.rmSync(distPath, { recursive: true, force: true });
        this.log('✅ Build cache (dist) cleared');
      }

      // Clean Vite cache
      const viteCachePath = path.join(this.projectRoot, 'node_modules', '.vite');
      if (fs.existsSync(viteCachePath)) {
        fs.rmSync(viteCachePath, { recursive: true, force: true });
        this.log('✅ Vite cache cleared');
      }

      // Clean any other build artifacts
      const buildArtifacts = [
        '.cache',
        '.parcel-cache',
        '.next',
        'out'
      ];

      for (const artifact of buildArtifacts) {
        const artifactPath = path.join(this.projectRoot, artifact);
        if (fs.existsSync(artifactPath)) {
          fs.rmSync(artifactPath, { recursive: true, force: true });
          this.log(`✅ ${artifact} cache cleared`);
        }
      }

    } catch (error) {
      this.log(`❌ Error cleaning build cache: ${error.message}`);
    }
  }

  async installDependencies() {
    try {
      this.log('📦 Installing dependencies...');
      execSync('npm ci --production=false', { stdio: 'inherit' });
      this.log('✅ Dependencies installed');
    } catch (error) {
      this.log(`❌ Error installing dependencies: ${error.message}`);
      throw error;
    }
  }

  async buildProject() {
    try {
      this.log('🔨 Building project for production...');
      execSync('npm run build', { stdio: 'inherit' });
      this.log('✅ Project built successfully');
    } catch (error) {
      this.log(`❌ Error building project: ${error.message}`);
      throw error;
    }
  }

  async optimizeAssets() {
    try {
      this.log('⚡ Optimizing assets...');
      
      const distPath = path.join(this.projectRoot, 'dist');
      if (fs.existsSync(distPath)) {
        // Check if assets exist
        const assetsPath = path.join(distPath, 'assets');
        if (fs.existsSync(assetsPath)) {
          const files = fs.readdirSync(assetsPath);
          this.log(`📊 Found ${files.length} asset files`);
          
          // Log file sizes for monitoring
          for (const file of files) {
            const filePath = path.join(assetsPath, file);
            const stats = fs.statSync(filePath);
            const sizeKB = (stats.size / 1024).toFixed(2);
            this.log(`📄 ${file}: ${sizeKB} KB`);
          }
        }
      }
      
      this.log('✅ Assets optimized');
    } catch (error) {
      this.log(`❌ Error optimizing assets: ${error.message}`);
    }
  }

  async generateBuildInfo() {
    try {
      this.log('📋 Generating build information...');
      
      const buildInfo = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production',
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        buildId: process.env.BUILD_ID || 'manual',
        commitSha: process.env.COMMIT_REF || 'unknown',
        branch: process.env.BRANCH || 'unknown'
      };

      const buildInfoPath = path.join(this.projectRoot, 'dist', 'build-info.json');
      fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
      
      this.log('✅ Build information generated');
      this.log(`📄 Build info: ${JSON.stringify(buildInfo, null, 2)}`);
      
    } catch (error) {
      this.log(`❌ Error generating build info: ${error.message}`);
    }
  }

  async performBuild() {
    try {
      this.log('🚀 Starting Netlify build process...');
      
      // Step 1: Clean build cache
      await this.cleanBuildCache();
      
      // Step 2: Install dependencies
      await this.installDependencies();
      
      // Step 3: Build project
      await this.buildProject();
      
      // Step 4: Optimize assets
      await this.optimizeAssets();
      
      // Step 5: Generate build info
      await this.generateBuildInfo();
      
      this.log('🎉 Netlify build completed successfully!');
      
    } catch (error) {
      this.log(`💥 Build failed: ${error.message}`);
      process.exit(1);
    }
  }
}

// Run the build process
const build = new NetlifyBuild();
build.performBuild(); 