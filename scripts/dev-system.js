const { spawn, execSync } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.join(rootDir, 'frontend');
const backendDir = path.join(rootDir, 'backend');

console.log('============================================================');
console.log('    🛠️  متجر كنوز KOUNOZ — تشغيل بيئة التطوير (Development) 🛠️    ');
console.log('============================================================\n');

function killPort(port) {
  if (process.platform === 'win32') {
    try {
      const output = execSync(`netstat -ano -p tcp | findstr :${port}`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
      });
      const lines = output.trim().split('\n');
      const pids = new Set();
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5 && parts[1].endsWith(`:${port}`) && parts[3] === 'LISTENING') {
          const pid = parts[4];
          if (pid && pid !== '0' && pid !== String(process.pid)) {
            pids.add(pid);
          }
        }
      }
      for (const pid of pids) {
        try {
          execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
        } catch {}
      }
    } catch {}
  } else {
    try {
      execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'ignore' });
    } catch {}
  }
}

killPort(3000);
killPort(5000);

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

// تشغيل Backend في وضع التطوير
const backendProcess = spawn(`${npmCmd} run dev`, {
  cwd: backendDir,
  shell: true,
  env: { ...process.env, PORT: '5000', NODE_ENV: 'development' },
});

backendProcess.stdout?.on('data', (data) => {
  data.toString().split('\n').forEach((line) => {
    if (line.trim()) console.log(`\x1b[36m[Backend Dev]\x1b[0m  ${line}`);
  });
});

backendProcess.stderr?.on('data', (data) => {
  data.toString().split('\n').forEach((line) => {
    if (line.trim()) console.error(`\x1b[31m[Backend Dev]\x1b[0m ${line}`);
  });
});

// تشغيل Frontend في وضع التطوير
const frontendProcess = spawn(`${npmCmd} run dev`, {
  cwd: frontendDir,
  shell: true,
  env: { ...process.env, PORT: '3000', NODE_ENV: 'development' },
});

frontendProcess.stdout?.on('data', (data) => {
  data.toString().split('\n').forEach((line) => {
    if (line.trim()) console.log(`\x1b[32m[Frontend Dev]\x1b[0m ${line}`);
  });
});

frontendProcess.stderr?.on('data', (data) => {
  data.toString().split('\n').forEach((line) => {
    if (line.trim()) console.error(`\x1b[33m[Frontend Dev]\x1b[0m ${line}`);
  });
});

function killProcessTree(proc) {
  if (!proc || !proc.pid) return;
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /F /T /PID ${proc.pid}`, { stdio: 'ignore' });
    } else {
      process.kill(-proc.pid, 'SIGTERM');
    }
  } catch {}
}

let isTerminating = false;
function gracefulShutdown() {
  if (isTerminating) return;
  isTerminating = true;
  console.log('\n\n🛑 جاري إيقاف بيئة التطوير...');
  killProcessTree(backendProcess);
  killProcessTree(frontendProcess);
  killPort(3000);
  killPort(5000);
  console.log('✅ تم الإيقاف.\n');
  process.exit(0);
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('exit', () => {
  killProcessTree(backendProcess);
  killProcessTree(frontendProcess);
});
