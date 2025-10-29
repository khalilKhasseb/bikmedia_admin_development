/**
 * Manual test cases for URL fix utility
 * 
 * This file contains test cases that can be run manually or converted
 * to proper unit tests when a testing framework is added to the project.
 */

import { fixImageUrl, fixImageUrls, fixImageUrlInObject, fixImageUrlsInObjects } from './url-fix.js';

// Test cases for fixImageUrl function
const testCases = [
  // Malformed URLs that need fixing
  { input: 'https://example.com/filesvga', expected: 'https://example.com/file.svga' },
  { input: 'https://example.com/imagewebp', expected: 'https://example.com/image.webp' },
  { input: 'https://example.com/photopng', expected: 'https://example.com/photo.png' },
  { input: 'https://example.com/picturejpg', expected: 'https://example.com/picture.jpg' },
  { input: 'https://example.com/imagejpeg', expected: 'https://example.com/image.jpeg' },
  { input: 'https://example.com/animationgif', expected: 'https://example.com/animation.gif' },
  
  // Already correct URLs (should not be modified)
  { input: 'https://example.com/file.svga', expected: 'https://example.com/file.svga' },
  { input: 'https://example.com/image.webp', expected: 'https://example.com/image.webp' },
  { input: 'https://example.com/photo.png', expected: 'https://example.com/photo.png' },
  { input: 'https://example.com/picture.jpg', expected: 'https://example.com/picture.jpg' },
  { input: 'https://example.com/image.jpeg', expected: 'https://example.com/image.jpeg' },
  { input: 'https://example.com/animation.gif', expected: 'https://example.com/animation.gif' },
  
  // Edge cases
  { input: '', expected: '' },
  { input: null, expected: null },
  { input: undefined, expected: undefined },
  { input: 'https://example.com/file', expected: 'https://example.com/file' },
  { input: 'https://example.com/file.unknown', expected: 'https://example.com/file.unknown' },
  { input: 'not-a-url-svga', expected: 'not-a-url-.svga' },
];

// Manual test runner function
export function runTests() {
  console.log('Running URL fix utility tests...\n');
  
  let passed = 0;
  let failed = 0;
  
  testCases.forEach((testCase, index) => {
    const result = fixImageUrl(testCase.input);
    const success = result === testCase.expected;
    
    if (success) {
      passed++;
      console.log(`✅ Test ${index + 1}: PASSED`);
    } else {
      failed++;
      console.log(`❌ Test ${index + 1}: FAILED`);
      console.log(`   Input: ${testCase.input}`);
      console.log(`   Expected: ${testCase.expected}`);
      console.log(`   Got: ${result}`);
    }
  });
  
  console.log(`\nTest Results: ${passed} passed, ${failed} failed`);
  
  // Test array processing
  console.log('\nTesting array processing...');
  const testUrls = [
    'https://example.com/file1svga',
    'https://example.com/file2.png',
    'https://example.com/file3webp'
  ];
  const fixedUrls = fixImageUrls(testUrls);
  console.log('Original:', testUrls);
  console.log('Fixed:', fixedUrls);
  
  // Test object processing
  console.log('\nTesting object processing...');
  const testObj = { id: 1, name: 'Test', icon: 'https://example.com/iconsvga' };
  const fixedObj = fixImageUrlInObject(testObj);
  console.log('Original:', testObj);
  console.log('Fixed:', fixedObj);
  
  // Test array of objects processing
  console.log('\nTesting array of objects processing...');
  const testObjects = [
    { id: 1, name: 'Item 1', icon: 'https://example.com/icon1svga' },
    { id: 2, name: 'Item 2', icon: 'https://example.com/icon2.png' },
    { id: 3, name: 'Item 3', icon: 'https://example.com/icon3webp' }
  ];
  const fixedObjects = fixImageUrlsInObjects(testObjects);
  console.log('Original:', testObjects);
  console.log('Fixed:', fixedObjects);
  
  return { passed, failed };
}

// Export test cases for potential future use with testing frameworks
export { testCases };