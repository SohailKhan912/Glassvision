#!/usr/bin/env node

/**
 * TestSprite Helper Script
 * 
 * This script helps prepare the project for TestSprite testing
 * and provides utilities for running tests.
 * 
 * Usage:
 *   node scripts/testsprite-helper.js check
 *   node scripts/testsprite-helper.js info
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const CONFIG_FILE = path.join(PROJECT_ROOT, 'testsprite.config.json');

function checkProjectSetup() {
  console.log('🔍 Checking GlassVision project setup for TestSprite...\n');
  
  const checks = {
    'Config file exists': fs.existsSync(CONFIG_FILE),
    'Frontend package.json exists': fs.existsSync(path.join(PROJECT_ROOT, 'package.json')),
    'Backend server.js exists': fs.existsSync(path.join(PROJECT_ROOT, 'server.js')),
    'App directory exists': fs.existsSync(path.join(PROJECT_ROOT, 'app')),
    'Components directory exists': fs.existsSync(path.join(PROJECT_ROOT, 'components')),
  };
  
  let allPassed = true;
  for (const [check, passed] of Object.entries(checks)) {
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${check}`);
    if (!passed) allPassed = false;
  }
  
  console.log('\n');
  if (allPassed) {
    console.log('✅ All checks passed! Project is ready for TestSprite.\n');
  } else {
    console.log('❌ Some checks failed. Please fix the issues above.\n');
  }
  
  return allPassed;
}

function showProjectInfo() {
  console.log('📋 GlassVision Project Information\n');
  console.log('Project Type: Full-stack E-commerce Application');
  console.log('Frontend: Next.js 16.0.0 (TypeScript)');
  console.log('Backend: Express.js (JavaScript)');
  console.log('Database: MongoDB');
  console.log('\nKey Features:');
  console.log('  - User authentication (JWT)');
  console.log('  - Product catalog with filtering');
  console.log('  - 3D door model customization');
  console.log('  - AR preview (mobile)');
  console.log('  - Shopping cart');
  console.log('  - Checkout with Razorpay');
  console.log('  - Order tracking');
  console.log('  - Admin dashboard');
  console.log('\nPorts:');
  console.log('  - Frontend: http://localhost:3000');
  console.log('  - Backend: http://localhost:5000');
  console.log('\nDefault Admin:');
  console.log('  - Email: admin@glassvision.com');
  console.log('  - Password: admin123');
  console.log('\n📚 Documentation:');
  console.log('  - Setup Guide: TESTSprite_SETUP.md');
  console.log('  - Project Info: testsprite-project-info.md');
  console.log('  - Config: testsprite.config.json\n');
}

function showTestSpriteInstructions() {
  console.log('🧪 TestSprite Testing Instructions\n');
  console.log('1. Install TestSprite MCP Server:');
  console.log('   npm install -g @testsprite/mcp-server');
  console.log('   OR');
  console.log('   npx @testsprite/cli install\n');
  
  console.log('2. Start your application:');
  console.log('   Terminal 1: node server.js (backend on port 5000)');
  console.log('   Terminal 2: npm run dev (frontend on port 3000)');
  console.log('   Terminal 3: mongod (MongoDB)\n');
  
  console.log('3. Use TestSprite MCP tools:');
  console.log('   - testsprite_bootstrap_tests');
  console.log('   - testsprite_generate_code_summary');
  console.log('   - testsprite_generate_code_and_execute\n');
  
  console.log('4. Review test results and fix any issues.\n');
  console.log('For detailed instructions, see: TESTSprite_SETUP.md\n');
}

// Main execution
const command = process.argv[2] || 'check';

switch (command) {
  case 'check':
    checkProjectSetup();
    break;
  case 'info':
    showProjectInfo();
    break;
  case 'instructions':
    showTestSpriteInstructions();
    break;
  case 'help':
  default:
    console.log('TestSprite Helper Script\n');
    console.log('Usage: node scripts/testsprite-helper.js <command>\n');
    console.log('Commands:');
    console.log('  check         - Check if project is ready for TestSprite');
    console.log('  info          - Show project information');
    console.log('  instructions  - Show TestSprite setup instructions');
    console.log('  help          - Show this help message\n');
    break;
}

