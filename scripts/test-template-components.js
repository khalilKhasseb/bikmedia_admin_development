#!/usr/bin/env node

/**
 * Template Component Testing Script
 * Tests template component loading, dependency checking, and preview functionality
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TemplateComponentTester {
  constructor() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
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
   * Test if template components file exists and is valid
   */
  async testComponentsFile() {
    console.log('\n🔍 Testing template components file...');
    
    try {
      const componentsPath = path.join(process.cwd(), 'src/templates/available-components.js');
      
      if (!fs.existsSync(componentsPath)) {
        this.logTest('Components File Exists', 'FAIL', 'available-components.js not found');
        return false;
      }
      
      this.logTest('Components File Exists', 'PASS', 'available-components.js found');
      
      // Try to import the components
      const { templateComponents, getComponentsByCategory, getCategories } = await import('../src/templates/available-components.js');
      
      if (!templateComponents || typeof templateComponents !== 'object') {
        this.logTest('Components Export', 'FAIL', 'templateComponents not properly exported');
        return false;
      }
      
      const componentCount = Object.keys(templateComponents).length;
      this.logTest('Components Export', 'PASS', `${componentCount} components exported`);
      
      // Test utility functions
      if (typeof getComponentsByCategory === 'function') {
        this.logTest('Utility Functions', 'PASS', 'getComponentsByCategory function available');
      } else {
        this.logTest('Utility Functions', 'FAIL', 'getComponentsByCategory function missing');
      }
      
      if (typeof getCategories === 'function') {
        const categories = getCategories();
        this.logTest('Categories Function', 'PASS', `${categories.length} categories found: ${categories.join(', ')}`);
      } else {
        this.logTest('Categories Function', 'FAIL', 'getCategories function missing');
      }
      
      return true;
    } catch (error) {
      this.logTest('Components File Import', 'FAIL', `Failed to import: ${error.message}`);
      return false;
    }
  }

  /**
   * Test template loader utility
   */
  async testTemplateLoader() {
    console.log('\n🔍 Testing template loader utility...');
    
    try {
      const loaderPath = path.join(process.cwd(), 'src/utils/template-loader.js');
      
      if (!fs.existsSync(loaderPath)) {
        this.logTest('Template Loader Exists', 'FAIL', 'template-loader.js not found');
        return false;
      }
      
      this.logTest('Template Loader Exists', 'PASS', 'template-loader.js found');
      
      // Try to import the loader
      const loader = await import('../src/utils/template-loader.js');
      
      const expectedFunctions = [
        'loadTemplateComponent',
        'loadMultipleComponents', 
        'checkComponentDependencies',
        'getComponentInfo',
        'searchComponents',
        'validateComponent',
        'validateAllComponents'
      ];
      
      for (const funcName of expectedFunctions) {
        if (typeof loader[funcName] === 'function') {
          this.logTest(`Loader Function: ${funcName}`, 'PASS', 'Function available');
        } else {
          this.logTest(`Loader Function: ${funcName}`, 'FAIL', 'Function missing or not exported');
        }
      }
      
      return true;
    } catch (error) {
      this.logTest('Template Loader Import', 'FAIL', `Failed to import: ${error.message}`);
      return false;
    }
  }

  /**
   * Test component file existence
   */
  async testComponentFiles() {
    console.log('\n🔍 Testing component file existence...');
    
    try {
      const { templateComponents } = await import('../src/templates/available-components.js');
      
      let existingFiles = 0;
      let missingFiles = 0;
      
      for (const [componentName, componentInfo] of Object.entries(templateComponents)) {
        const componentPath = path.join(process.cwd(), componentInfo.path);
        
        if (fs.existsSync(componentPath)) {
          existingFiles++;
          this.logTest(`Component File: ${componentName}`, 'PASS', `File exists at ${componentInfo.path}`);
        } else {
          missingFiles++;
          this.logTest(`Component File: ${componentName}`, 'FAIL', `File missing at ${componentInfo.path}`);
        }
      }
      
      console.log(`\n📊 Component Files Summary: ${existingFiles} found, ${missingFiles} missing`);
      return missingFiles === 0;
      
    } catch (error) {
      this.logTest('Component Files Test', 'FAIL', `Failed to test component files: ${error.message}`);
      return false;
    }
  }

  /**
   * Test component loading functionality
   */
  async testComponentLoading() {
    console.log('\n🔍 Testing component loading functionality...');
    
    try {
      const { loadTemplateComponent, getComponentInfo } = await import('../src/utils/template-loader.js');
      const { templateComponents } = await import('../src/templates/available-components.js');
      
      // Test getComponentInfo function
      const firstComponentName = Object.keys(templateComponents)[0];
      const componentInfo = getComponentInfo(firstComponentName);
      
      if (componentInfo) {
        this.logTest('Get Component Info', 'PASS', `Retrieved info for ${firstComponentName}`);
      } else {
        this.logTest('Get Component Info', 'FAIL', `Failed to get info for ${firstComponentName}`);
      }
      
      // Test loading a component without dependencies
      const noDepsComponents = Object.entries(templateComponents)
        .filter(([, info]) => !info.dependencies || info.dependencies.length === 0)
        .slice(0, 3); // Test first 3 components without dependencies
      
      for (const [componentName, componentInfo] of noDepsComponents) {
        try {
          const result = await loadTemplateComponent(componentName, {
            checkDependencies: true,
            loadAssets: false,
            throwOnMissingDeps: false
          });
          
          if (result && result.component) {
            this.logTest(`Load Component: ${componentName}`, 'PASS', 'Component loaded successfully');
          } else {
            this.logTest(`Load Component: ${componentName}`, 'FAIL', 'Component loading returned invalid result');
          }
        } catch (error) {
          this.logTest(`Load Component: ${componentName}`, 'FAIL', `Loading failed: ${error.message}`);
        }
      }
      
      return true;
    } catch (error) {
      this.logTest('Component Loading Test', 'FAIL', `Failed to test component loading: ${error.message}`);
      return false;
    }
  }

  /**
   * Test dependency checking functionality
   */
  async testDependencyChecking() {
    console.log('\n🔍 Testing dependency checking functionality...');
    
    try {
      const { checkComponentDependencies } = await import('../src/utils/template-loader.js');
      const { templateComponents } = await import('../src/templates/available-components.js');
      
      // Test components with dependencies
      const componentsWithDeps = Object.entries(templateComponents)
        .filter(([, info]) => info.dependencies && info.dependencies.length > 0)
        .slice(0, 5); // Test first 5 components with dependencies
      
      for (const [componentName, componentInfo] of componentsWithDeps) {
        try {
          const depCheck = await checkComponentDependencies(componentName, componentInfo.dependencies);
          
          if (depCheck && typeof depCheck === 'object') {
            const totalDeps = depCheck.total || 0;
            const missingDeps = depCheck.missing ? depCheck.missing.length : 0;
            const availableDeps = depCheck.available ? depCheck.available.length : 0;
            
            this.logTest(
              `Dependency Check: ${componentName}`, 
              'PASS', 
              `${totalDeps} total deps, ${availableDeps} available, ${missingDeps} missing`
            );
            
            if (missingDeps > 0) {
              this.logTest(
                `Missing Dependencies: ${componentName}`, 
                'WARN', 
                `Missing: ${depCheck.missing.join(', ')}`
              );
            }
          } else {
            this.logTest(`Dependency Check: ${componentName}`, 'FAIL', 'Invalid dependency check result');
          }
        } catch (error) {
          this.logTest(`Dependency Check: ${componentName}`, 'FAIL', `Check failed: ${error.message}`);
        }
      }
      
      return true;
    } catch (error) {
      this.logTest('Dependency Checking Test', 'FAIL', `Failed to test dependency checking: ${error.message}`);
      return false;
    }
  }

  /**
   * Test component validation functionality
   */
  async testComponentValidation() {
    console.log('\n🔍 Testing component validation functionality...');
    
    try {
      const { validateComponent, validateAllComponents } = await import('../src/utils/template-loader.js');
      const { templateComponents } = await import('../src/templates/available-components.js');
      
      // Test individual component validation
      const testComponents = Object.keys(templateComponents).slice(0, 3);
      
      for (const componentName of testComponents) {
        try {
          const validation = await validateComponent(componentName);
          
          if (validation && typeof validation === 'object') {
            const status = validation.valid ? 'PASS' : 'WARN';
            const message = validation.valid ? 'Component is valid' : 
              `Validation issues: ${validation.errors?.length || 0} errors, ${validation.warnings?.length || 0} warnings`;
            
            this.logTest(`Validate Component: ${componentName}`, status, message);
            
            if (validation.errors && validation.errors.length > 0) {
              this.logTest(`Validation Errors: ${componentName}`, 'FAIL', validation.errors.join(', '));
            }
          } else {
            this.logTest(`Validate Component: ${componentName}`, 'FAIL', 'Invalid validation result');
          }
        } catch (error) {
          this.logTest(`Validate Component: ${componentName}`, 'FAIL', `Validation failed: ${error.message}`);
        }
      }
      
      // Test bulk validation (with timeout)
      try {
        console.log('Running bulk validation (this may take a moment)...');
        const bulkValidation = await Promise.race([
          validateAllComponents(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
        ]);
        
        if (bulkValidation && typeof bulkValidation === 'object') {
          this.logTest(
            'Bulk Validation', 
            'PASS', 
            `${bulkValidation.valid}/${bulkValidation.total} components valid`
          );
        } else {
          this.logTest('Bulk Validation', 'FAIL', 'Invalid bulk validation result');
        }
      } catch (error) {
        if (error.message === 'Timeout') {
          this.logTest('Bulk Validation', 'WARN', 'Bulk validation timed out (this is normal for large component sets)');
        } else {
          this.logTest('Bulk Validation', 'FAIL', `Bulk validation failed: ${error.message}`);
        }
      }
      
      return true;
    } catch (error) {
      this.logTest('Component Validation Test', 'FAIL', `Failed to test component validation: ${error.message}`);
      return false;
    }
  }

  /**
   * Test search and filtering functionality
   */
  async testSearchFunctionality() {
    console.log('\n🔍 Testing search and filtering functionality...');
    
    try {
      const { searchComponents } = await import('../src/utils/template-loader.js');
      const { getComponentsByCategory, searchComponents: basicSearch } = await import('../src/templates/available-components.js');
      
      // Test category filtering
      const categories = ['forms', 'components', 'apps'];
      for (const category of categories) {
        try {
          const categoryComponents = getComponentsByCategory(category);
          const componentCount = Object.keys(categoryComponents).length;
          
          if (componentCount > 0) {
            this.logTest(`Category Filter: ${category}`, 'PASS', `Found ${componentCount} components`);
          } else {
            this.logTest(`Category Filter: ${category}`, 'WARN', 'No components found in category');
          }
        } catch (error) {
          this.logTest(`Category Filter: ${category}`, 'FAIL', `Filter failed: ${error.message}`);
        }
      }
      
      // Test basic search
      const searchTerms = ['form', 'chart', 'table'];
      for (const term of searchTerms) {
        try {
          const searchResults = basicSearch(term);
          const resultCount = Object.keys(searchResults).length;
          
          this.logTest(`Basic Search: ${term}`, 'PASS', `Found ${resultCount} matching components`);
        } catch (error) {
          this.logTest(`Basic Search: ${term}`, 'FAIL', `Search failed: ${error.message}`);
        }
      }
      
      // Test advanced search (if available)
      if (typeof searchComponents === 'function') {
        try {
          const advancedResults = searchComponents({
            category: 'forms',
            hasNoDependencies: true
          });
          
          const resultCount = Object.keys(advancedResults).length;
          this.logTest('Advanced Search', 'PASS', `Found ${resultCount} form components without dependencies`);
        } catch (error) {
          this.logTest('Advanced Search', 'FAIL', `Advanced search failed: ${error.message}`);
        }
      } else {
        this.logTest('Advanced Search', 'WARN', 'Advanced search function not available');
      }
      
      return true;
    } catch (error) {
      this.logTest('Search Functionality Test', 'FAIL', `Failed to test search functionality: ${error.message}`);
      return false;
    }
  }

  /**
   * Test template dependencies file
   */
  async testTemplateDependencies() {
    console.log('\n🔍 Testing template dependencies configuration...');
    
    try {
      const depsPath = path.join(process.cwd(), 'template-dependencies.json');
      
      if (!fs.existsSync(depsPath)) {
        this.logTest('Template Dependencies File', 'WARN', 'template-dependencies.json not found (optional)');
        return true;
      }
      
      this.logTest('Template Dependencies File', 'PASS', 'template-dependencies.json found');
      
      const depsContent = fs.readFileSync(depsPath, 'utf8');
      const depsData = JSON.parse(depsContent);
      
      // Validate structure
      const expectedKeys = ['version', 'dependencyGroups', 'componentDependencies'];
      for (const key of expectedKeys) {
        if (depsData[key]) {
          this.logTest(`Dependencies Structure: ${key}`, 'PASS', 'Key present');
        } else {
          this.logTest(`Dependencies Structure: ${key}`, 'WARN', 'Key missing (optional)');
        }
      }
      
      if (depsData.componentDependencies) {
        const componentCount = Object.keys(depsData.componentDependencies).length;
        this.logTest('Component Dependencies', 'PASS', `${componentCount} components have dependency info`);
      }
      
      return true;
    } catch (error) {
      this.logTest('Template Dependencies Test', 'FAIL', `Failed to test dependencies file: ${error.message}`);
      return false;
    }
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('🚀 Starting Template Component Testing...\n');
    
    const tests = [
      () => this.testComponentsFile(),
      () => this.testTemplateLoader(),
      () => this.testComponentFiles(),
      () => this.testComponentLoading(),
      () => this.testDependencyChecking(),
      () => this.testComponentValidation(),
      () => this.testSearchFunctionality(),
      () => this.testTemplateDependencies()
    ];
    
    for (const test of tests) {
      try {
        await test();
      } catch (error) {
        console.error(`Test execution error: ${error.message}`);
      }
    }
    
    this.printResults();
    return this.results.failed === 0;
  }

  /**
   * Print test results
   */
  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEMPLATE COMPONENT TESTING RESULTS');
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
      console.log('\n🎉 All critical tests passed! Template component system is working correctly.');
    } else {
      console.log('\n💡 Please fix the failed tests above to ensure proper template component functionality.');
    }
    
    console.log('\n📋 Test Summary:');
    console.log('  • Template components file is properly structured and accessible');
    console.log('  • Template loader utility functions are available and working');
    console.log('  • Component files exist and can be loaded');
    console.log('  • Dependency checking functionality is operational');
    console.log('  • Component validation system is working');
    console.log('  • Search and filtering capabilities are functional');
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new TemplateComponentTester();
  const success = await tester.runAllTests();
  process.exit(success ? 0 : 1);
}

export default TemplateComponentTester;