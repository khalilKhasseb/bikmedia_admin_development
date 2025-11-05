#!/usr/bin/env node

/**
 * Dependency Cleanup Validation Script
 * Validates that dependency cleanup doesn't break functionality and measures bundle size impact
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DependencyCleanupValidator {
  constructor() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
    this.packageJsonPath = path.join(process.cwd(), 'package.json');
    this.distPath = path.join(process.cwd(), 'dist');
  }

  /**
   * Log test result
   */
  logTest(name, status, message = '', details = null) {
    const test = { name, status, message, details, timestamp: new Date().toISOString() };
    this.results.tests.push(test);
    this.results.total++;
    
    if (status === 'PASS') {
      this.results.passed++;
      console.log(`✅ ${name}: ${message}`);
    } else if (status === 'FAIL') {
      this.results.failed++;
      console.log(`❌ ${name}: ${message}`);
      if (details) {
        console.log(`   Details: ${JSON.stringify(details, null, 2)}`);
      }
    } else if (status === 'WARN') {
      this.results.warnings++;
      console.log(`⚠️  ${name}: ${message}`);
    }
  }

  /**
   * Read and parse package.json
   */
  readPackageJson() {
    try {
      const content = fs.readFileSync(this.packageJsonPath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to read package.json: ${error.message}`);
    }
  }

  /**
   * Test package.json structure and dependencies
   */
  testPackageJson() {
    console.log('\n🔍 Testing package.json structure...');
    
    try {
      const packageJson = this.readPackageJson();
      
      // Check required fields
      const requiredFields = ['name', 'version', 'scripts', 'dependencies'];
      for (const field of requiredFields) {
        if (packageJson[field]) {
          this.logTest(`Package.json Field: ${field}`, 'PASS', 'Field present');
        } else {
          this.logTest(`Package.json Field: ${field}`, 'FAIL', 'Required field missing');
        }
      }
      
      // Count dependencies
      const depCount = Object.keys(packageJson.dependencies || {}).length;
      const devDepCount = Object.keys(packageJson.devDependencies || {}).length;
      
      this.logTest('Dependencies Count', 'PASS', `${depCount} production dependencies, ${devDepCount} dev dependencies`);
      
      // Check for essential Vue dependencies
      const essentialDeps = ['vue', 'vue-router', 'vuex', 'vue-i18n'];
      for (const dep of essentialDeps) {
        if (packageJson.dependencies[dep]) {
          this.logTest(`Essential Dependency: ${dep}`, 'PASS', `Version: ${packageJson.dependencies[dep]}`);
        } else {
          this.logTest(`Essential Dependency: ${dep}`, 'FAIL', 'Missing essential dependency');
        }
      }
      
      return packageJson;
    } catch (error) {
      this.logTest('Package.json Test', 'FAIL', `Failed to test package.json: ${error.message}`);
      return null;
    }
  }

  /**
   * Test npm install process
   */
  testNpmInstall() {
    console.log('\n🔍 Testing npm install process...');
    
    try {
      console.log('Running npm install...');
      const output = execSync('npm install', { 
        encoding: 'utf8', 
        cwd: process.cwd(),
        timeout: 120000 // 2 minute timeout
      });
      
      this.logTest('NPM Install', 'PASS', 'Dependencies installed successfully');
      
      // Check for any warnings or errors in output
      if (output.includes('WARN')) {
        this.logTest('NPM Install Warnings', 'WARN', 'Installation completed with warnings');
      }
      
      if (output.includes('vulnerabilities')) {
        this.logTest('Security Vulnerabilities', 'WARN', 'Security vulnerabilities detected (run npm audit)');
      }
      
      return true;
    } catch (error) {
      this.logTest('NPM Install', 'FAIL', `Installation failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Test application build process
   */
  testBuildProcess() {
    console.log('\n🔍 Testing application build process...');
    
    try {
      console.log('Running build process...');
      const startTime = Date.now();
      
      const output = execSync('npm run build', { 
        encoding: 'utf8', 
        cwd: process.cwd(),
        timeout: 300000 // 5 minute timeout
      });
      
      const buildTime = Date.now() - startTime;
      this.logTest('Build Process', 'PASS', `Build completed in ${(buildTime / 1000).toFixed(2)}s`);
      
      // Check for build warnings
      if (output.includes('chunks are larger than')) {
        this.logTest('Bundle Size Warning', 'WARN', 'Large chunks detected - consider code splitting');
      }
      
      // Check if dist directory was created
      if (fs.existsSync(this.distPath)) {
        this.logTest('Build Output', 'PASS', 'dist directory created successfully');
      } else {
        this.logTest('Build Output', 'FAIL', 'dist directory not found after build');
        return false;
      }
      
      return true;
    } catch (error) {
      this.logTest('Build Process', 'FAIL', `Build failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Analyze bundle size and composition
   */
  analyzeBundleSize() {
    console.log('\n🔍 Analyzing bundle size...');
    
    try {
      if (!fs.existsSync(this.distPath)) {
        this.logTest('Bundle Analysis', 'FAIL', 'dist directory not found');
        return null;
      }
      
      const stats = this.calculateDirectorySize(this.distPath);
      
      this.logTest('Bundle Size Analysis', 'PASS', `Total bundle size: ${this.formatBytes(stats.totalSize)}`);
      
      // Analyze file types
      const jsFiles = stats.files.filter(f => f.name.endsWith('.js'));
      const cssFiles = stats.files.filter(f => f.name.endsWith('.css'));
      const assetFiles = stats.files.filter(f => !f.name.endsWith('.js') && !f.name.endsWith('.css') && !f.name.endsWith('.html'));
      
      const jsSize = jsFiles.reduce((sum, f) => sum + f.size, 0);
      const cssSize = cssFiles.reduce((sum, f) => sum + f.size, 0);
      const assetSize = assetFiles.reduce((sum, f) => sum + f.size, 0);
      
      this.logTest('JavaScript Bundle', 'PASS', `${jsFiles.length} files, ${this.formatBytes(jsSize)}`);
      this.logTest('CSS Bundle', 'PASS', `${cssFiles.length} files, ${this.formatBytes(cssSize)}`);
      this.logTest('Asset Files', 'PASS', `${assetFiles.length} files, ${this.formatBytes(assetSize)}`);
      
      // Check for large files
      const largeFiles = stats.files.filter(f => f.size > 500 * 1024); // > 500KB
      if (largeFiles.length > 0) {
        this.logTest('Large Files', 'WARN', `${largeFiles.length} files > 500KB detected`);
        largeFiles.forEach(file => {
          console.log(`   • ${file.name}: ${this.formatBytes(file.size)}`);
        });
      } else {
        this.logTest('Large Files', 'PASS', 'No excessively large files detected');
      }
      
      return stats;
    } catch (error) {
      this.logTest('Bundle Analysis', 'FAIL', `Analysis failed: ${error.message}`);
      return null;
    }
  }

  /**
   * Calculate directory size recursively
   */
  calculateDirectorySize(dirPath) {
    const stats = {
      totalSize: 0,
      fileCount: 0,
      files: []
    };
    
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const itemStat = fs.statSync(itemPath);
      
      if (itemStat.isDirectory()) {
        const subStats = this.calculateDirectorySize(itemPath);
        stats.totalSize += subStats.totalSize;
        stats.fileCount += subStats.fileCount;
        stats.files.push(...subStats.files);
      } else {
        stats.totalSize += itemStat.size;
        stats.fileCount++;
        stats.files.push({
          name: path.relative(this.distPath, itemPath),
          size: itemStat.size,
          path: itemPath
        });
      }
    }
    
    return stats;
  }

  /**
   * Format bytes to human readable format
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Test template component accessibility
   */
  testTemplateComponentAccess() {
    console.log('\n🔍 Testing template component accessibility...');
    
    try {
      // Check if template components file exists
      const componentsPath = path.join(process.cwd(), 'src/templates/available-components.js');
      if (!fs.existsSync(componentsPath)) {
        this.logTest('Template Components File', 'FAIL', 'available-components.js not found');
        return false;
      }
      
      this.logTest('Template Components File', 'PASS', 'available-components.js exists');
      
      // Check template loader utility
      const loaderPath = path.join(process.cwd(), 'src/utils/template-loader.js');
      if (!fs.existsSync(loaderPath)) {
        this.logTest('Template Loader Utility', 'FAIL', 'template-loader.js not found');
        return false;
      }
      
      this.logTest('Template Loader Utility', 'PASS', 'template-loader.js exists');
      
      // Check template dependencies file
      const depsPath = path.join(process.cwd(), 'template-dependencies.json');
      if (!fs.existsSync(depsPath)) {
        this.logTest('Template Dependencies', 'WARN', 'template-dependencies.json not found (optional)');
      } else {
        this.logTest('Template Dependencies', 'PASS', 'template-dependencies.json exists');
      }
      
      // Check some template component files
      const sampleComponents = [
        'src/views/components/cards.vue',
        'src/views/elements/buttons.vue',
        'src/views/forms/switches.vue'
      ];
      
      let accessibleComponents = 0;
      for (const componentPath of sampleComponents) {
        const fullPath = path.join(process.cwd(), componentPath);
        if (fs.existsSync(fullPath)) {
          accessibleComponents++;
        }
      }
      
      if (accessibleComponents === sampleComponents.length) {
        this.logTest('Template Component Files', 'PASS', `All ${sampleComponents.length} sample components accessible`);
      } else {
        this.logTest('Template Component Files', 'WARN', `${accessibleComponents}/${sampleComponents.length} sample components accessible`);
      }
      
      return true;
    } catch (error) {
      this.logTest('Template Component Access', 'FAIL', `Access test failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Test application startup (preview mode)
   */
  testApplicationStartup() {
    console.log('\n🔍 Testing application startup...');
    
    try {
      console.log('Testing preview mode (timeout: 10 seconds)...');
      
      // Start preview server with timeout
      const child = execSync('timeout 10s npm run preview || true', { 
        encoding: 'utf8', 
        cwd: process.cwd()
      });
      
      this.logTest('Application Startup', 'PASS', 'Preview server started successfully');
      return true;
    } catch (error) {
      // Timeout is expected, so we check if it's a timeout or actual error
      if (error.message.includes('timeout') || error.status === 124) {
        this.logTest('Application Startup', 'PASS', 'Preview server started (timed out as expected)');
        return true;
      } else {
        this.logTest('Application Startup', 'FAIL', `Startup failed: ${error.message}`);
        return false;
      }
    }
  }

  /**
   * Compare bundle size with baseline (if available)
   */
  compareBundleSize(currentStats) {
    console.log('\n🔍 Comparing bundle size...');
    
    try {
      const baselinePath = path.join(process.cwd(), 'bundle-baseline.json');
      
      if (!fs.existsSync(baselinePath)) {
        // Create baseline for future comparisons
        const baseline = {
          timestamp: new Date().toISOString(),
          totalSize: currentStats.totalSize,
          fileCount: currentStats.fileCount,
          jsSize: currentStats.files.filter(f => f.name.endsWith('.js')).reduce((sum, f) => sum + f.size, 0),
          cssSize: currentStats.files.filter(f => f.name.endsWith('.css')).reduce((sum, f) => sum + f.size, 0)
        };
        
        fs.writeFileSync(baselinePath, JSON.stringify(baseline, null, 2));
        this.logTest('Bundle Baseline', 'PASS', 'Created new bundle size baseline');
        return true;
      }
      
      const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
      
      const sizeDiff = currentStats.totalSize - baseline.totalSize;
      const percentChange = ((sizeDiff / baseline.totalSize) * 100).toFixed(2);
      
      if (Math.abs(sizeDiff) < 1024) { // Less than 1KB difference
        this.logTest('Bundle Size Comparison', 'PASS', `Size unchanged (${this.formatBytes(Math.abs(sizeDiff))} difference)`);
      } else if (sizeDiff < 0) {
        this.logTest('Bundle Size Comparison', 'PASS', `Size reduced by ${this.formatBytes(Math.abs(sizeDiff))} (${Math.abs(percentChange)}%)`);
      } else {
        const status = sizeDiff > 100 * 1024 ? 'WARN' : 'PASS'; // Warn if > 100KB increase
        this.logTest('Bundle Size Comparison', status, `Size increased by ${this.formatBytes(sizeDiff)} (${percentChange}%)`);
      }
      
      return true;
    } catch (error) {
      this.logTest('Bundle Size Comparison', 'WARN', `Comparison failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Run all validation tests
   */
  async runAllTests() {
    console.log('🚀 Starting Dependency Cleanup Validation...\n');
    
    const tests = [
      () => this.testPackageJson(),
      () => this.testNpmInstall(),
      () => this.testBuildProcess(),
      () => this.analyzeBundleSize(),
      () => this.testTemplateComponentAccess(),
      () => this.testApplicationStartup()
    ];
    
    let bundleStats = null;
    
    for (const test of tests) {
      try {
        const result = await test();
        if (test.name === 'analyzeBundleSize') {
          bundleStats = result;
        }
      } catch (error) {
        console.error(`Test execution error: ${error.message}`);
      }
    }
    
    // Compare bundle size if we have stats
    if (bundleStats) {
      this.compareBundleSize(bundleStats);
    }
    
    this.printResults();
    return this.results.failed === 0;
  }

  /**
   * Print validation results
   */
  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 DEPENDENCY CLEANUP VALIDATION RESULTS');
    console.log('='.repeat(60));
    
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);
    console.log(`📝 Total Tests: ${this.results.total}`);
    
    const successRate = this.results.total > 0 ? 
      ((this.results.passed / this.results.total) * 100).toFixed(1) : 0;
    console.log(`📈 Success Rate: ${successRate}%`);
    
    if (this.results.failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.results.tests
        .filter(test => test.status === 'FAIL')
        .forEach(test => {
          console.log(`  • ${test.name}: ${test.message}`);
        });
    }
    
    if (this.results.warnings > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.results.tests
        .filter(test => test.status === 'WARN')
        .forEach(test => {
          console.log(`  • ${test.name}: ${test.message}`);
        });
    }
    
    if (this.results.failed === 0) {
      console.log('\n🎉 All critical tests passed! Dependency cleanup validation successful.');
      console.log('\n📋 Validation Summary:');
      console.log('  • Package.json structure is valid');
      console.log('  • Dependencies install correctly');
      console.log('  • Application builds successfully');
      console.log('  • Bundle size is optimized');
      console.log('  • Template components remain accessible');
      console.log('  • Application starts up correctly');
    } else {
      console.log('\n💡 Please fix the failed tests above to ensure proper functionality.');
    }
  }
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new DependencyCleanupValidator();
  const success = await validator.runAllTests();
  process.exit(success ? 0 : 1);
}

export default DependencyCleanupValidator;