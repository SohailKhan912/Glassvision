#!/usr/bin/env node

/**
 * TestSprite Test Execution Helper
 * 
 * This script helps coordinate TestSprite testing by:
 * 1. Verifying servers are running
 * 2. Providing test execution instructions
 * 3. Preparing test environment
 */

const http = require('http');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const FRONTEND_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:5000';

async function checkServer(url, name) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve({ running: true, status: res.statusCode, name });
    });
    
    req.on('error', () => {
      resolve({ running: false, name });
    });
    
    req.setTimeout(2000, () => {
      req.destroy();
      resolve({ running: false, name, error: 'timeout' });
    });
  });
}

async function checkServers() {
  console.log('🔍 Checking if servers are running...\n');
  
  const [frontend, backend] = await Promise.all([
    checkServer(FRONTEND_URL, 'Frontend'),
    checkServer(`${BACKEND_URL}/api/health`, 'Backend')
  ]);
  
  const allRunning = frontend.running && backend.running;
  
  console.log(`${frontend.running ? '✅' : '❌'} ${frontend.name}: ${frontend.running ? `Running on ${FRONTEND_URL}` : 'Not running'}`);
  console.log(`${backend.running ? '✅' : '❌'} ${backend.name}: ${backend.running ? `Running on ${BACKEND_URL}` : 'Not running'}`);
  console.log('');
  
  return allRunning;
}

function showTestSpriteInstructions() {
  console.log('🧪 TestSprite Testing Instructions\n');
  console.log('Since you have TestSprite MCP Server configured, you can use these MCP tools:\n');
  
  console.log('1️⃣  BOOTSTRAP TESTS');
  console.log('   Tool: testsprite_bootstrap_tests');
  console.log('   Parameters:');
  console.log('     - local_port: 3000');
  console.log('     - project_type: frontend');
  console.log('     - project_path: .');
  console.log('     - testing_scope: codebase\n');
  
  console.log('2️⃣  GENERATE CODE SUMMARY');
  console.log('   Tool: testsprite_generate_code_summary');
  console.log('   (Analyzes your codebase structure)\n');
  
  console.log('3️⃣  GENERATE & EXECUTE TESTS');
  console.log('   Tool: testsprite_generate_code_and_execute');
  console.log('   Parameters:');
  console.log('     - project_name: glassvision');
  console.log('     - project_path: .');
  console.log('     - test_ids: [] (empty for all tests)');
  console.log('     - additional_instructions: "Test authentication, 3D models, AR view, cart, checkout, and admin dashboard"\n');
  
  console.log('📋 Test Coverage Areas:');
  console.log('   ✅ User authentication (login, register, logout)');
  console.log('   ✅ Admin authentication');
  console.log('   ✅ Product catalog and filtering');
  console.log('   ✅ 3D door model viewer');
  console.log('   ✅ AR preview interface');
  console.log('   ✅ Shopping cart operations');
  console.log('   ✅ Checkout process');
  console.log('   ✅ Order tracking');
  console.log('   ✅ Admin dashboard');
  console.log('   ✅ API endpoints (backend)\n');
  
  console.log('💡 How to Use:');
  console.log('   Ask your AI assistant to:');
  console.log('   - "Run TestSprite bootstrap tests"');
  console.log('   - "Generate TestSprite code summary"');
  console.log('   - "Run all TestSprite tests"');
  console.log('   - "Test authentication with TestSprite"\n');
}

function showTestPlan() {
  console.log('📋 Recommended Test Execution Order:\n');
  
  console.log('Phase 1: Code Analysis');
  console.log('  → Generate code summary');
  console.log('  → Bootstrap test environment\n');
  
  console.log('Phase 2: Frontend Tests');
  console.log('  → Authentication flows');
  console.log('  → Product catalog');
  console.log('  → 3D model viewer');
  console.log('  → Shopping cart\n');
  
  console.log('Phase 3: Backend Tests');
  console.log('  → API endpoints');
  console.log('  → Authentication API');
  console.log('  → Product API');
  console.log('  → Order API\n');
  
  console.log('Phase 4: Integration Tests');
  console.log('  → Full user journey');
  console.log('  → Admin workflows');
  console.log('  → Payment processing\n');
}

async function main() {
  console.log('🚀 TestSprite Test Execution Helper\n');
  console.log('='.repeat(50) + '\n');
  
  const serversRunning = await checkServers();
  
  if (!serversRunning) {
    console.log('⚠️  Warning: Some servers are not running!');
    console.log('   Please start them before running tests:\n');
    console.log('   Terminal 1: npm run server');
    console.log('   Terminal 2: npm run dev\n');
    console.log('   Then run this script again.\n');
    return;
  }
  
  console.log('✅ All servers are running!\n');
  console.log('='.repeat(50) + '\n');
  
  const command = process.argv[2];
  
  switch (command) {
    case 'plan':
      showTestPlan();
      break;
    case 'instructions':
      showTestSpriteInstructions();
      break;
    case 'help':
    default:
      showTestSpriteInstructions();
      console.log('\n' + '='.repeat(50) + '\n');
      showTestPlan();
      console.log('\n💡 Usage:');
      console.log('   node scripts/run-testsprite-tests.js [command]');
      console.log('\n   Commands:');
      console.log('     (no command) - Show all information');
      console.log('     instructions  - Show TestSprite tool usage');
      console.log('     plan         - Show test execution plan');
      console.log('     help         - Show this help\n');
      break;
  }
}

main().catch(console.error);

