#!/usr/bin/env node

/**
 * Comprehensive Documentation Link Test
 * Tests all critical navigation paths and cross-references
 */

import fs from 'fs';
import path from 'path';

class ComprehensiveLinkTest {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  test(description, testFn) {
    try {
      testFn();
      this.results.passed++;
      this.results.tests.push({ description, status: 'PASS' });
      console.log(`✅ ${description}`);
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ description, status: 'FAIL', error: error.message });
      console.log(`❌ ${description}: ${error.message}`);
    }
  }

  fileExists(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
  }

  linkExists(sourceFile, targetPath) {
    const content = fs.readFileSync(sourceFile, 'utf8');
    if (!content.includes(targetPath)) {
      throw new Error(`Link not found in ${sourceFile}: ${targetPath}`);
    }
  }

  run() {
    console.log('🧪 Running Comprehensive Documentation Link Tests\n');

    // Test 1: All phase directories exist
    this.test('Phase directories exist', () => {
      const phases = ['Phase-1-Architecture', 'Phase-2-Quality', 'Phase-3-Development', 'Phase-4-Features', 'Phase-5-Deployment'];
      phases.forEach(phase => {
        this.fileExists(path.join('DOCS', phase));
        this.fileExists(path.join('DOCS', phase, 'README.md'));
      });
    });

    // Test 2: All moved documentation files exist in correct locations
    this.test('Moved documentation files exist', () => {
      const files = [
        'DOCS/Phase-1-Architecture/PROJECT_ARCHITECTURE_ANALYSIS.md',
        'DOCS/Phase-1-Architecture/PROJECT_MIGRATION_STARTUP_PROMPT.md',
        'DOCS/Phase-2-Quality/CODE_QUALITY_TECHNICAL_DEBT_ANALYSIS.md',
        'DOCS/Phase-3-Development/DEVELOPMENT_WORKFLOW_BEST_PRACTICES_ANALYSIS.md',
        'DOCS/Phase-4-Features/ENTITY_MANAGEMENT_ANALYSIS.md',
        'DOCS/Phase-5-Deployment/API_BACKEND_ALIGNMENT_ANALYSIS.md',
        'DOCS/Phase-5-Deployment/CLEANUP_OPTIMIZATION_RECOMMENDATIONS.md'
      ];
      files.forEach(file => this.fileExists(file));
    });

    // Test 3: Main DOCS README has all phase links
    this.test('Main DOCS README has phase navigation', () => {
      const mainReadme = 'DOCS/README.md';
      this.fileExists(mainReadme);
      
      const phases = ['Phase-1-Architecture', 'Phase-2-Quality', 'Phase-3-Development', 'Phase-4-Features', 'Phase-5-Deployment'];
      phases.forEach(phase => {
        this.linkExists(mainReadme, `./${phase}/`);
      });
    });

    // Test 4: Phase navigation links work
    this.test('Phase navigation links are correct', () => {
      // Phase 1 -> Phase 2
      this.linkExists('DOCS/Phase-1-Architecture/README.md', '../Phase-2-Quality/README.md');
      
      // Phase 2 -> Phase 1 and Phase 3
      this.linkExists('DOCS/Phase-2-Quality/README.md', '../Phase-1-Architecture/README.md');
      this.linkExists('DOCS/Phase-2-Quality/README.md', '../Phase-3-Development/README.md');
      
      // Phase 3 -> Phase 2 and Phase 4
      this.linkExists('DOCS/Phase-3-Development/README.md', '../Phase-2-Quality/README.md');
      this.linkExists('DOCS/Phase-3-Development/README.md', '../Phase-4-Features/README.md');
      
      // Phase 4 -> Phase 3 and Phase 5
      this.linkExists('DOCS/Phase-4-Features/README.md', '../Phase-3-Development/README.md');
      this.linkExists('DOCS/Phase-4-Features/README.md', '../Phase-5-Deployment/README.md');
      
      // Phase 5 -> Phase 4
      this.linkExists('DOCS/Phase-5-Deployment/README.md', '../Phase-4-Features/README.md');
    });

    // Test 5: All phases link back to main documentation
    this.test('All phases link back to main documentation', () => {
      const phases = ['Phase-1-Architecture', 'Phase-2-Quality', 'Phase-3-Development', 'Phase-4-Features', 'Phase-5-Deployment'];
      phases.forEach(phase => {
        this.linkExists(`DOCS/${phase}/README.md`, '../README.md');
      });
    });

    // Test 6: Template Components documentation exists
    this.test('Template Components documentation exists', () => {
      const templateFiles = [
        'DOCS/Template-Components/README.md',
        'DOCS/Template-Components/component-catalog.md',
        'DOCS/Template-Components/adoption-guide.md',
        'DOCS/Template-Components/examples.md'
      ];
      templateFiles.forEach(file => this.fileExists(file));
    });

    // Test 7: Template utilities exist
    this.test('Template utilities exist', () => {
      this.fileExists('src/utils/template-loader.js');
      this.fileExists('src/utils/template-adopter.js');
      this.fileExists('src/templates/available-components.js');
    });

    // Test 8: No old documentation files remain in root
    this.test('No old documentation files in root', () => {
      const oldFiles = [
        'PROJECT_ARCHITECTURE_ANALYSIS.md',
        'CODE_QUALITY_TECHNICAL_DEBT_ANALYSIS.md',
        'DEVELOPMENT_WORKFLOW_BEST_PRACTICES_ANALYSIS.md',
        'ENTITY_MANAGEMENT_ANALYSIS.md',
        'API_BACKEND_ALIGNMENT_ANALYSIS.md',
        'CLEANUP_OPTIMIZATION_RECOMMENDATIONS.md'
      ];
      
      oldFiles.forEach(file => {
        if (fs.existsSync(file)) {
          throw new Error(`Old documentation file still exists in root: ${file}`);
        }
      });
    });

    this.printResults();
    return this.results.failed === 0;
  }

  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 COMPREHENSIVE TEST RESULTS');
    console.log('='.repeat(60));
    console.log(`✅ Tests passed: ${this.results.passed}`);
    console.log(`❌ Tests failed: ${this.results.failed}`);
    console.log(`📈 Success rate: ${Math.round((this.results.passed / (this.results.passed + this.results.failed)) * 100)}%`);

    if (this.results.failed === 0) {
      console.log('\n🎉 All documentation links and navigation are working correctly!');
      console.log('📚 Documentation organization is complete and validated.');
    } else {
      console.log('\n💡 Please fix the failed tests above.');
    }
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new ComprehensiveLinkTest();
  const success = tester.run();
  process.exit(success ? 0 : 1);
}

export default ComprehensiveLinkTest;