// Test file to check Markets import
import React from 'react';

// Test individual imports
console.log('Testing React:', typeof React);

try {
  const Markets = require('./pages/Markets.jsx');
  console.log('Markets require result:', Markets);
  console.log('Markets default:', Markets.default);
  console.log('Markets type:', typeof Markets.default);
} catch (e) {
  console.error('Markets require error:', e);
}

// Test ES6 import
import('./pages/Markets.jsx')
  .then(module => {
    console.log('Markets dynamic import:', module);
    console.log('Markets default from dynamic:', module.default);
    console.log('Type:', typeof module.default);
  })
  .catch(e => {
    console.error('Markets dynamic import error:', e);
  });