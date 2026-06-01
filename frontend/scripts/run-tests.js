#!/usr/bin/env node

/**
 * Test Execution Script
 * Runs all tests and generates a comprehensive test report
 */

const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const util = require('util')

const execPromise = util.promisify(exec)
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000'

async function checkServers() {
  console.log('🔍 Checking if servers are running...\n')
  
  try {
    const http = require('http')
    
    const checkServer = (url, name) => {
      return new Promise((resolve) => {
        const req = http.get(url, (res) => {
          resolve({ running: true, name })
        })
        req.on('error', () => resolve({ running: false, name }))
        req.setTimeout(2000, () => {
          req.destroy()
          resolve({ running: false, name })
        })
      })
    }

    const [frontend, backend] = await Promise.all([
      checkServer('http://localhost:3000', 'Frontend'),
      checkServer(`${API_BASE}/api/health`, 'Backend'),
    ])

    console.log(`${frontend.running ? '✅' : '❌'} ${frontend.name}: ${frontend.running ? 'Running' : 'Not running'}`)
    console.log(`${backend.running ? '✅' : '❌'} ${backend.name}: ${backend.running ? 'Running' : 'Not running'}\n`)

    return frontend.running && backend.running
  } catch (error) {
    console.log('⚠️  Could not check servers\n')
    return false
  }
}

async function installDependencies() {
  console.log('📦 Installing test dependencies...\n')
  
  try {
    const { stdout, stderr } = await execPromise('npm install', { cwd: process.cwd() })
    if (stderr && !stderr.includes('npm WARN')) {
      console.error('Install warnings:', stderr)
    }
    console.log('✅ Dependencies installed\n')
    return true
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message)
    return false
  }
}

async function runTests(testType = 'all') {
  console.log(`🧪 Running ${testType} tests...\n`)

  const testCommands = {
    all: 'npm test',
    watch: 'npm run test:watch',
    coverage: 'npm run test:coverage',
    ci: 'npm run test:ci',
  }

  const command = testCommands[testType] || testCommands.all

  try {
    const { stdout, stderr } = await execPromise(command, {
      cwd: process.cwd(),
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer
    })

    console.log(stdout)
    if (stderr) {
      console.error(stderr)
    }

    return { success: true, output: stdout }
  } catch (error) {
    console.error('Test execution error:', error.message)
    return { success: false, output: error.stdout || error.message }
  }
}

async function generateTestReport(testResults) {
  const reportPath = path.join(process.cwd(), 'test-report.json')
  const report = {
    timestamp: new Date().toISOString(),
    project: 'GlassVision',
    testResults,
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
    },
  }

  // Parse test results (simplified - in real scenario, parse Jest output)
  if (testResults.output) {
    const output = testResults.output
    const passedMatch = output.match(/(\d+) passed/)
    const failedMatch = output.match(/(\d+) failed/)
    
    if (passedMatch) report.summary.passed = parseInt(passedMatch[1])
    if (failedMatch) report.summary.failed = parseInt(failedMatch[1])
    report.summary.total = report.summary.passed + report.summary.failed
  }

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(`\n📊 Test report saved to: ${reportPath}\n`)

  return report
}

async function main() {
  console.log('🚀 GlassVision Test Suite Execution\n')
  console.log('='.repeat(50) + '\n')

  const args = process.argv.slice(2)
  const testType = args[0] || 'all'
  const skipServerCheck = args.includes('--skip-server-check')
  const skipInstall = args.includes('--skip-install')

  // Step 1: Check servers
  if (!skipServerCheck) {
    const serversRunning = await checkServers()
    if (!serversRunning) {
      console.log('⚠️  Warning: Some servers may not be running.')
      console.log('   Tests that require servers may fail.\n')
    }
  }

  // Step 2: Install dependencies
  if (!skipInstall) {
    const depsInstalled = await installDependencies()
    if (!depsInstalled) {
      console.log('⚠️  Warning: Dependency installation had issues.\n')
    }
  }

  // Step 3: Run tests
  const testResults = await runTests(testType)

  // Step 4: Generate report
  const report = await generateTestReport(testResults)

  // Step 5: Summary
  console.log('='.repeat(50))
  console.log('📋 Test Execution Summary\n')
  console.log(`Total Tests: ${report.summary.total}`)
  console.log(`✅ Passed: ${report.summary.passed}`)
  console.log(`❌ Failed: ${report.summary.failed}`)
  console.log(`⏭️  Skipped: ${report.summary.skipped}`)
  console.log(`\nStatus: ${testResults.success ? '✅ SUCCESS' : '❌ FAILED'}\n`)

  process.exit(testResults.success ? 0 : 1)
}

main().catch(console.error)

