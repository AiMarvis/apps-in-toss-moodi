import { execSync, spawn } from 'node:child_process';
import process from 'node:process';

const ENDPOINT = 'http://127.0.0.1:7242/ingest/6f9769ae-46ff-436e-a206-6ec54f3c862a';
const SESSION_ID = 'debug-session';
const RUN_ID = process.env.MOODI_RUN_ID || `granite-dev-${Date.now()}`;
const PROJECT_DIR = process.cwd();

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
  }).catch(() => {});
  // #endregion
}

function execText(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch {
    // findstr returns exit code 1 when no matches; treat as empty.
    return '';
  }
}

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
  const cmd = `powershell -NoProfile -Command "(Get-CimInstance Win32_Process -Filter \\"ProcessId=${pid}\\").CommandLine"`;
  return execText(cmd).trim();
}

function safeKill(pid) {
  execText(`taskkill /PID ${pid} /F`);
}

function cleanupPort(port, hypothesisId) {
  const netstat = execText(`cmd /c netstat -ano ^| findstr :${port}`);
  const entries = parseNetstatPids(netstat);
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
    const looksLikeVite = cmdLower.includes('vite\\bin\\vite.js') && cmdLower.includes(projLower);
    const looksLikeGranite =
      (cmdLower.includes('@apps-in-toss\\web-framework\\bin.js') && cmdLower.includes(' dev')) ||
      (cmdLower.includes('@apps-in-toss/web-framework/bin.js') && cmdLower.includes(' dev')) ||
      (cmdLower.includes(' granite ') && cmdLower.includes(' dev'));

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
});

// H1: 8081 is held by a leftover granite dev.
cleanupPort(8081, 'H1');
// H2: 5173 is held by a leftover vite dev. (Granite starts Vite too)
cleanupPort(5173, 'H2');

log('H3', 'scripts/granite-dev.mjs:main', 'spawn_granite', { cmd: 'granite dev' });
const child = spawn('granite', ['dev'], { stdio: 'inherit', shell: true, env: process.env });

child.on('exit', (code, signal) => {
  log('H3', 'scripts/granite-dev.mjs:main', 'granite_exit', { code, signal });
  process.exit(code ?? 1);
});






