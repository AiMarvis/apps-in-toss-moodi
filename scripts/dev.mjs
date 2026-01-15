import { execSync, spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const ENDPOINT = 'http://127.0.0.1:7242/ingest/6f9769ae-46ff-436e-a206-6ec54f3c862a';
const SESSION_ID = 'debug-session';
const RUN_ID = process.env.MOODI_RUN_ID || `vite-dev-${Date.now()}`;
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
  } catch (e) {
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
  const out = execText(cmd).trim();
  return out;
}

function safeKill(pid) {
  execText(`taskkill /PID ${pid} /F`);
}

function cleanupPort(port, hypothesisId) {
  const netstat = execText(`cmd /c netstat -ano ^| findstr :${port}`);
  const entries = parseNetstatPids(netstat);
  log(hypothesisId, `scripts/dev.mjs:cleanupPort`, 'port_check', {
    port,
    entries: entries.map((e) => ({ pid: e.pid, line: e.line })),
  });

  for (const { pid, line } of entries) {
    const cmdline = getCommandLine(pid);
    log(hypothesisId, `scripts/dev.mjs:cleanupPort`, 'port_owner', {
      port,
      pid,
      // CommandLine may contain local paths; no secrets. Truncate for safety.
      cmdline: cmdline ? cmdline.slice(0, 300) : '',
      line,
    });

    // Only auto-kill processes that look like our project's dev servers.
    const cmdLower = (cmdline || '').toLowerCase();
    const projLower = PROJECT_DIR.toLowerCase();

    const looksLikeVite = cmdLower.includes('vite\\bin\\vite.js') && cmdLower.includes(projLower);
    const looksLikeGranite =
      (cmdLower.includes('@apps-in-toss\\web-framework\\bin.js') && cmdLower.includes(' dev')) ||
      (cmdLower.includes('@apps-in-toss/web-framework/bin.js') && cmdLower.includes(' dev'));

    const safeToKill = looksLikeVite || (looksLikeGranite && cmdLower.includes(projLower));

    if (safeToKill) {
      log(hypothesisId, `scripts/dev.mjs:cleanupPort`, 'auto_kill', { port, pid });
      safeKill(pid);
    } else {
      log(hypothesisId, `scripts/dev.mjs:cleanupPort`, 'port_in_use_not_killed', { port, pid });
    }
  }
}

log('H1', 'scripts/dev.mjs:main', 'start', {
  cwd: PROJECT_DIR,
  node: process.version,
  argv: process.argv.slice(2),
});

// H1: 8081 is held by a leftover granite dev. H2: 5173 is held by a leftover vite dev.
cleanupPort(8081, 'H1');
cleanupPort(5173, 'H2');

// Start Vite with strict 5173 so we fail fast if something else is using it.
const viteBin = path.resolve(PROJECT_DIR, 'node_modules', 'vite', 'bin', 'vite.js');
log('H3', 'scripts/dev.mjs:main', 'spawn_vite', { viteBin, args: ['--host', '--port', '5173', '--strictPort'] });

const child = spawn(process.execPath, [viteBin, '--host', '--port', '5173', '--strictPort'], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code, signal) => {
  log('H3', 'scripts/dev.mjs:main', 'vite_exit', { code, signal });
  process.exit(code ?? 1);
});


