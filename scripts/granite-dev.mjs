import { execSync, spawn } from 'node:child_process';
import process from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ENDPOINT = 'http://127.0.0.1:7242/ingest/6f9769ae-46ff-436e-a206-6ec54f3c862a';
const SESSION_ID = 'debug-session';
const RUN_ID = process.env.MOODI_RUN_ID || `granite-dev-${Date.now()}`;
const PROJECT_DIR = process.cwd();
const IS_WINDOWS = os.platform() === 'win32';

function log(hypothesisId, location, message, data) {
  // #region agent log
  fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: SESSION_ID,
      runId: RUN_ID,
      hypothesisId,
      location,
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => { });
  // #endregion
}

function execText(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch {
    return '';
  }
}

// macOS/Linux: lsof를 사용하여 포트를 점유한 PID들을 파싱
function parseLsofPids(output) {
  const lines = output
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const entries = [];
  // lsof 출력: COMMAND PID USER FD TYPE DEVICE SIZE/OFF NODE NAME
  // 첫 번째 줄은 헤더이므로 스킵
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const parts = line.split(/\s+/);
    if (parts.length >= 2) {
      const pid = Number(parts[1]);
      if (Number.isFinite(pid) && pid > 0) {
        entries.push({ pid, line, command: parts[0] });
      }
    }
  }
  return entries;
}

// Windows: netstat 출력 파싱
function parseNetstatPids(output) {
  const lines = output
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const entries = [];
  for (const line of lines) {
    const parts = line.split(/\s+/);
    const pid = Number(parts[parts.length - 1]);
    if (Number.isFinite(pid) && pid > 0) {
      entries.push({ pid, line });
    }
  }
  return entries;
}

function getCommandLine(pid) {
  if (IS_WINDOWS) {
    const cmd = `powershell -NoProfile -Command "(Get-CimInstance Win32_Process -Filter \\"ProcessId=${pid}\\").CommandLine"`;
    return execText(cmd).trim();
  } else {
    // macOS/Linux: ps 명령어로 커맨드라인 가져오기
    return execText(`ps -p ${pid} -o args=`).trim();
  }
}

function safeKill(pid) {
  if (IS_WINDOWS) {
    execText(`taskkill /PID ${pid} /F`);
  } else {
    // macOS/Linux: kill -9 사용
    execText(`kill -9 ${pid}`);
  }
}

function cleanupPort(port, hypothesisId) {
  let entries = [];

  if (IS_WINDOWS) {
    const netstat = execText(`cmd /c netstat -ano ^| findstr :${port}`);
    entries = parseNetstatPids(netstat);
  } else {
    // macOS/Linux: lsof 사용
    const lsofOutput = execText(`lsof -i :${port} -P -n`);
    entries = parseLsofPids(lsofOutput);
  }

  log(hypothesisId, `scripts/granite-dev.mjs:cleanupPort`, 'port_check', {
    port,
    entries: entries.map((e) => ({ pid: e.pid, line: e.line })),
  });

  for (const { pid, line } of entries) {
    const cmdline = getCommandLine(pid);
    const cmdLower = (cmdline || '').toLowerCase();
    const projLower = PROJECT_DIR.toLowerCase();

    log(hypothesisId, `scripts/granite-dev.mjs:cleanupPort`, 'port_owner', {
      port,
      pid,
      cmdline: cmdline ? cmdline.slice(0, 300) : '',
      line,
    });

    // Only auto-kill processes that look like OUR project's dev servers.
    const looksLikeVite =
      (cmdLower.includes('vite/bin/vite.js') || cmdLower.includes('vite\\bin\\vite.js')) &&
      cmdLower.includes(projLower);
    const looksLikeGranite =
      (cmdLower.includes('@apps-in-toss/web-framework/bin.js') && cmdLower.includes('dev')) ||
      (cmdLower.includes('@apps-in-toss\\web-framework\\bin.js') && cmdLower.includes('dev')) ||
      (cmdLower.includes('granite') && cmdLower.includes('dev'));

    const safeToKill = looksLikeVite || (looksLikeGranite && cmdLower.includes(projLower));

    if (safeToKill) {
      log(hypothesisId, `scripts/granite-dev.mjs:cleanupPort`, 'auto_kill', { port, pid });
      safeKill(pid);
    } else {
      log(hypothesisId, `scripts/granite-dev.mjs:cleanupPort`, 'port_in_use_not_killed', { port, pid });
    }
  }
}

log('H1', 'scripts/granite-dev.mjs:main', 'start', {
  cwd: PROJECT_DIR,
  node: process.version,
  platform: os.platform(),
});

// H1: 8081 is held by a leftover granite dev.
cleanupPort(8081, 'H1');
// H2: 5173 is held by a leftover vite dev. (Granite starts Vite too)
cleanupPort(5173, 'H2');

log('H3', 'scripts/granite-dev.mjs:main', 'spawn_granite', { cmd: 'node granite dev' });
const graniteBin = path.resolve(__dirname, '../node_modules/@apps-in-toss/web-framework/bin.js');
// shell: false로 변경하여 deprecation 경고 제거
const child = spawn('node', [graniteBin, 'dev'], { stdio: 'inherit', shell: false, env: process.env });

child.on('exit', (code, signal) => {
  log('H3', 'scripts/granite-dev.mjs:main', 'granite_exit', { code, signal });
  process.exit(code ?? 1);
});






