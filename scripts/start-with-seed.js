#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Collab & Fun development server...');

// First, seed the database
console.log('📊 Seeding database...');
const seedProcess = spawn('node', ['-e', 'require("./src/lib/seed.ts").seedDatabase()'], {
  cwd: process.cwd(),
  stdio: 'inherit'
});

seedProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Database seeded successfully!');
    
    // Then start the development server
    console.log('🌐 Starting Next.js development server...');
    const devProcess = spawn('npm', ['run', 'dev'], {
      cwd: process.cwd(),
      stdio: 'inherit'
    });

    devProcess.on('close', (code) => {
      console.log(`Development server exited with code ${code}`);
    });

    // Handle Ctrl+C
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down...');
      devProcess.kill('SIGINT');
    });
  } else {
    console.error('❌ Failed to seed database');
    process.exit(1);
  }
});

seedProcess.on('error', (error) => {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
});
