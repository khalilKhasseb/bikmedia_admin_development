/**
 * RTL Support Test Utility
 * Tests RTL functionality for Arabic language support
 */

export const testRTLSupport = () => {
  const tests = [];
  
  // Test 1: Check if document direction is set correctly
  const documentDirection = document.documentElement.getAttribute('dir');
  tests.push({
    name: 'Document Direction',
    passed: documentDirection === 'rtl' || documentDirection === 'ltr',
    value: documentDirection,
    expected: 'rtl or ltr'
  });
  
  // Test 2: Check if language attribute is set
  const documentLang = document.documentElement.getAttribute('lang');
  tests.push({
    name: 'Document Language',
    passed: documentLang === 'ar' || documentLang === 'en',
    value: documentLang,
    expected: 'ar or en'
  });
  
  // Test 3: Check if RTL CSS is loaded
  const rtlStyles = document.querySelector('style, link[href*="rtl"]');
  tests.push({
    name: 'RTL Styles',
    passed: !!rtlStyles || document.querySelector('[dir="rtl"]'),
    value: rtlStyles ? 'Found' : 'Not found',
    expected: 'RTL styles should be available'
  });
  
  // Test 4: Check if Arabic font is applied
  const bodyFontFamily = window.getComputedStyle(document.body).fontFamily;
  const hasArabicFont = bodyFontFamily.includes('Tajawal') || 
                       bodyFontFamily.includes('Cairo') || 
                       bodyFontFamily.includes('Amiri');
  tests.push({
    name: 'Arabic Font Support',
    passed: hasArabicFont || documentLang !== 'ar',
    value: bodyFontFamily,
    expected: 'Arabic fonts when language is Arabic'
  });
  
  return tests;
};

export const logRTLTestResults = () => {
  const results = testRTLSupport();
  console.group('🌐 RTL Support Test Results');
  
  results.forEach(test => {
    const status = test.passed ? '✅' : '❌';
    console.log(`${status} ${test.name}: ${test.value} (Expected: ${test.expected})`);
  });
  
  const passedTests = results.filter(test => test.passed).length;
  const totalTests = results.length;
  
  console.log(`\n📊 Summary: ${passedTests}/${totalTests} tests passed`);
  console.groupEnd();
  
  return {
    passed: passedTests,
    total: totalTests,
    success: passedTests === totalTests
  };
};

// Auto-run tests in development mode
if (process.env.NODE_ENV === 'development') {
  // Run tests after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', logRTLTestResults);
  } else {
    logRTLTestResults();
  }
}