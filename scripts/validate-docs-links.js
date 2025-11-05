#!/usr/bin/env node

/**
 * Documentation Link Validator
 * Validates all internal markdown links in the DOCS directory
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class LinkValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.validated = 0;
  }

  /**
   * Find all markdown files in a directory recursively
   */
  findMarkdownFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...this.findMarkdownFiles(fullPath));
      } else if (item.endsWith('.md')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Extract markdown links from content
   */
  extractLinks(content) {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links = [];
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      const text = match[1];
      const url = match[2];

      // Skip malformed links or code examples
      if (url.includes('[^') || url.includes(']+') || text.includes('[^')) {
        continue;
      }

      links.push({
        text,
        url,
        fullMatch: match[0]
      });
    }

    return links;
  }

  /**
   * Validate a single link
   */
  validateLink(link, sourceFile) {
    const { url, text } = link;

    // Skip external links
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return true;
    }

    // Skip anchors and other non-file links
    if (url.startsWith('#') || url.startsWith('mailto:')) {
      return true;
    }

    // Resolve relative path
    const sourceDir = path.dirname(sourceFile);
    const targetPath = path.resolve(sourceDir, url);

    // Check if file exists
    if (!fs.existsSync(targetPath)) {
      this.errors.push({
        sourceFile,
        link: text,
        url,
        targetPath,
        error: 'File not found'
      });
      return false;
    }

    this.validated++;
    return true;
  }

  /**
   * Validate all links in a file
   */
  validateFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const links = this.extractLinks(content);

      for (const link of links) {
        this.validateLink(link, filePath);
      }
    } catch (error) {
      this.errors.push({
        sourceFile: filePath,
        error: `Failed to read file: ${error.message}`
      });
    }
  }

  /**
   * Validate template component file references
   */
  validateTemplateComponentReferences() {
    console.log('🧩 Validating template component references...');

    const templateDocsDir = path.join(process.cwd(), 'DOCS', 'Template-Components');
    if (!fs.existsSync(templateDocsDir)) {
      this.warnings.push('Template-Components directory not found');
      return;
    }

    // Check if template component files exist
    const componentCatalogPath = path.join(templateDocsDir, 'component-catalog.md');
    if (fs.existsSync(componentCatalogPath)) {
      const content = fs.readFileSync(componentCatalogPath, 'utf8');
      
      // Extract file paths mentioned in the catalog
      const pathRegex = /`(src\/[^`]+\.vue)`/g;
      let match;
      
      while ((match = pathRegex.exec(content)) !== null) {
        const filePath = match[1];
        const fullPath = path.join(process.cwd(), filePath);
        
        if (!fs.existsSync(fullPath)) {
          this.warnings.push(`Template component file referenced but not found: ${filePath}`);
        }
      }
    }

    // Check template loader utility references
    const templateLoaderPath = path.join(process.cwd(), 'src', 'utils', 'template-loader.js');
    if (fs.existsSync(templateLoaderPath)) {
      const content = fs.readFileSync(templateLoaderPath, 'utf8');
      
      // Check if available-components.js is referenced correctly
      if (content.includes('available-components.js')) {
        const availableComponentsPath = path.join(process.cwd(), 'src', 'templates', 'available-components.js');
        if (!fs.existsSync(availableComponentsPath)) {
          this.warnings.push('template-loader.js references available-components.js but file not found');
        }
      }
    }
  }

  /**
   * Validate phase navigation links specifically
   */
  validatePhaseNavigation() {
    const phases = [
      'Phase-1-Architecture',
      'Phase-2-Quality', 
      'Phase-3-Development',
      'Phase-4-Features',
      'Phase-5-Deployment'
    ];

    console.log('🔗 Validating phase navigation links...');

    for (let i = 0; i < phases.length; i++) {
      const currentPhase = phases[i];
      const readmePath = path.join(process.cwd(), 'DOCS', currentPhase, 'README.md');
      
      if (!fs.existsSync(readmePath)) {
        this.errors.push({
          sourceFile: readmePath,
          error: `Phase README not found: ${currentPhase}/README.md`
        });
        continue;
      }

      const content = fs.readFileSync(readmePath, 'utf8');
      
      // Check for navigation links
      if (i > 0) {
        const prevPhase = phases[i - 1];
        if (!content.includes(`../Phase-${i}-`) && !content.includes(`../${prevPhase}/`)) {
          this.warnings.push(`${currentPhase}/README.md: Missing previous phase navigation link`);
        }
      }
      
      if (i < phases.length - 1) {
        const nextPhase = phases[i + 1];
        if (!content.includes(`../Phase-${i + 2}-`) && !content.includes(`../${nextPhase}/`)) {
          this.warnings.push(`${currentPhase}/README.md: Missing next phase navigation link`);
        }
      }

      // Check for back to main docs link
      if (!content.includes('../README.md')) {
        this.warnings.push(`${currentPhase}/README.md: Missing back to main documentation link`);
      }
    }
  }

  /**
   * Run validation on all markdown files
   */
  validate() {
    console.log('🔍 Validating documentation links...\n');

    const docsDir = path.join(process.cwd(), 'DOCS');
    if (!fs.existsSync(docsDir)) {
      console.error('❌ DOCS directory not found');
      return false;
    }

    const markdownFiles = this.findMarkdownFiles(docsDir);
    console.log(`Found ${markdownFiles.length} markdown files to validate\n`);

    for (const file of markdownFiles) {
      console.log(`Validating: ${path.relative(process.cwd(), file)}`);
      this.validateFile(file);
    }

    // Additional validation for phase navigation
    this.validatePhaseNavigation();

    // Validate template component references
    this.validateTemplateComponentReferences();

    this.printResults();
    return this.errors.length === 0;
  }

  /**
   * Print validation results
   */
  printResults() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 VALIDATION RESULTS');
    console.log('='.repeat(50));

    console.log(`✅ Links validated: ${this.validated}`);
    console.log(`❌ Errors found: ${this.errors.length}`);
    console.log(`⚠️  Warnings: ${this.warnings.length}`);

    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      for (const error of this.errors) {
        console.log(`\n  File: ${path.relative(process.cwd(), error.sourceFile)}`);
        if (error.link) {
          console.log(`  Link: "${error.link}"`);
          console.log(`  URL: ${error.url}`);
          console.log(`  Target: ${path.relative(process.cwd(), error.targetPath)}`);
        }
        console.log(`  Error: ${error.error}`);
      }
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      for (const warning of this.warnings) {
        console.log(`  ${warning}`);
      }
    }

    if (this.errors.length === 0) {
      console.log('\n🎉 All documentation links are valid!');
    } else {
      console.log('\n💡 Please fix the broken links above.');
    }
  }
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new LinkValidator();
  const success = validator.validate();
  process.exit(success ? 0 : 1);
}

export default LinkValidator;