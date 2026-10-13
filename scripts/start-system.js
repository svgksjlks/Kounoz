const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.join(rootDir, 'frontend');
const backendDir = path.join(rootDir, 'backend');

const noBrowser = process.argv.includes('--no-browser');

console.log('============================================================');
console.log('       🌟 متجر كنوز KOUNOZ — تشغيل النظام المتكامل 🌟       ');
console.log('============================================================\n');

// ── 1. تنظيف المنافذ القديمة لمنع أخطاء EADDRINUSE ───────────
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

console.log('🔍 [1/3] فحص وتنظيف المنافذ (3000 و 5000)...');
killPort(3000);
killPort(5000);
console.log('   ✓ المنافذ جاهزة.\n');

// ── 2. التحقق من وجود نسخة الإنتاج (.next) ───────────────────
console.log('📦 [2/3] فحص بناء الواجهة الأمامية (Production Build)...');
const nextBuildDir = path.join(frontendDir, '.next');
if (!fs.existsSync(nextBuildDir)) {
  console.log('   ⚠️  لم يتم العثور على نسخة .next، جاري البناء لأول مرة...');
  try {
    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    execSync(`${npmCmd} run build`, {
      cwd: frontendDir,
      stdio: 'inherit',
      shell: true,
    });
    console.log('   ✓ تم البناء بنجاح.\n');
  } catch (err) {
    console.error('   ❌ حدث خطأ أثناء بناء الواجهة الأمامية!');
    process.exit(1);
  }
} else {
  console.log('   ✓ نسخة الإنتاج موجودة وجاهزة.\n');
}

// ── 3. تشغيل السيرفرات (Backend + Frontend) ──────────────────
console.log('🚀 [3/3] تشغيل السيرفرات...');
console.log('   • تشغيل Backend على المنفذ 5000');
console.log('   • تشغيل Frontend على المنفذ 3000\n');

// تشغيل Backend
const backendProcess = spawn('node src/server.js', {
  cwd: backendDir,
  shell: true,
  env: { ...process.env, PORT: '5000', NODE_ENV: 'production' },
});

backendProcess.stdout?.on('data', (data) => {
  const text = data.toString();
  text.split('\n').forEach((line) => {
    if (line.trim()) console.log(`\x1b[36m[Backend]\x1b[0m  ${line}`);
  });
});

backendProcess.stderr?.on('data', (data) => {
  const text = data.toString();
  text.split('\n').forEach((line) => {
    if (line.trim()) console.error(`\x1b[31m[Backend Error]\x1b[0m ${line}`);
  });
});

// تشغيل Frontend
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const frontendProcess = spawn(`${npmCmd} run start`, {
  cwd: frontendDir,
  shell: true,
  env: { ...process.env, PORT: '3000', NODE_ENV: 'production' },
});

frontendProcess.stdout?.on('data', (data) => {
  const text = data.toString();
  text.split('\n').forEach((line) => {
    if (line.trim()) console.log(`\x1b[32m[Frontend]\x1b[0m ${line}`);
  });
});

frontendProcess.stderr?.on('data', (data) => {
  const text = data.toString();
  text.split('\n').forEach((line) => {
    if (line.trim()) console.error(`\x1b[33m[Frontend Warn]\x1b[0m ${line}`);
  });
});

// ── 4. فحص الجاهزية وفتح المتصفح تلقائياً ──────────────────────
if (!noBrowser) {
  let browserOpened = false;
  const pollInterval = setInterval(() => {
    const req = http.get('http://localhost:3000', (res) => {
      if (!browserOpened) {
        browserOpened = true;
        clearInterval(pollInterval);
        console.log('\n============================================================');
        console.log('  🎉 السيستم يعمل بالكامل وبكفاءة عالية!');
        console.log('  👉 رابط المتجر (Frontend):  \x1b[32mhttp://localhost:3000\x1b[0m');
        console.log('  👉 سيرفر الـ API (Backend):  \x1b[36mhttp://localhost:5000\x1b[0m');
        console.log('============================================================');
        console.log('  (اضغط Ctrl + C في أي وقت لإيقاف السيستم بالكامل)\n');

        try {
          if (process.platform === 'win32') {
            execSync('start http://localhost:3000', { stdio: 'ignore', shell: true });
          } else if (process.platform === 'darwin') {
            execSync('open http://localhost:3000', { stdio: 'ignore' });
          } else {
            execSync('xdg-open http://localhost:3000', { stdio: 'ignore' });
          }
        } catch {}
      }
    });
    req.on('error', () => {
      // السيرفر لم يكتمل إقلاعه بعد
    });
    req.setTimeout(800, () => req.destroy());
  }, 1000);

  setTimeout(() => clearInterval(pollInterval), 40000);
}

// ── 5. الإغلاق الآمن لكافة العمليات عند الإنهاء ────────────────
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
  console.log('\n\n🛑 جاري إيقاف جميع سيرفرات النظام...');
  killProcessTree(backendProcess);
  killProcessTree(frontendProcess);
  killPort(3000);
  killPort(5000);
  console.log('✅ تم إيقاف النظام بنجاح.\n');
  process.exit(0);
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('exit', () => {
  killProcessTree(backendProcess);
  killProcessTree(frontendProcess);
});
