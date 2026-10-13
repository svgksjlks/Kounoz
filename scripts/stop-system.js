const { execSync } = require('child_process');

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
          console.log(`[OK] إيقاف العملية القديمة على المنفذ ${port} (PID: ${pid})`);
        } catch {}
      }
    } catch {}
  } else {
    try {
      execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'ignore' });
      console.log(`[OK] Stopped process on port ${port}`);
    } catch {}
  }
}

console.log('🛑 جاري تنظيف وإيقاف المنافذ 3000 و 5000...');
killPort(3000);
killPort(5000);
console.log('✅ تم إيقاف جميع السيرفرات بنجاح.');
