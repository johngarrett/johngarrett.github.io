import browserSync from "browser-sync";
import chokidar from "chokidar";
import { existsSync } from "node:fs";
import { rename, rm } from "node:fs/promises";
import path from "node:path";

const serve = Bun.argv.includes("--serve");
const outputDir = path.resolve("html-output");
const stagingDir = path.resolve(`.dev-output-${process.pid}`);
const previousDir = path.resolve(`.dev-output-previous-${process.pid}`);
const browser = browserSync.create("garrepi-dev");

let activeBuild: ReturnType<typeof Bun.spawn> | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let building = false;
let stopping = false;
const pendingPaths = new Set<string>();

function log(message: string) {
  console.log(`[watch] ${message}`);
}

async function publishBuild() {
  await rm(previousDir, { recursive: true, force: true });
  const hadPreviousBuild = existsSync(outputDir);

  if (hadPreviousBuild) await rename(outputDir, previousDir);
  try {
    await rename(stagingDir, outputDir);
  } catch (error) {
    if (hadPreviousBuild) await rename(previousDir, outputDir);
    throw error;
  }

  await rm(previousDir, { recursive: true, force: true });
}

async function buildOnce(changedPaths: string[]) {
  await rm(stagingDir, { recursive: true, force: true });
  log(`rebuilding after ${changedPaths.join(", ")}`);
  const startedAt = performance.now();

  activeBuild = Bun.spawn(["bun", "run", "build"], {
    cwd: process.cwd(),
    env: { ...process.env, BUILD_OUTPUT_DIR: stagingDir },
    stdout: "inherit",
    stderr: "inherit",
  });

  const exitCode = await activeBuild.exited;
  activeBuild = null;
  if (exitCode !== 0) {
    await rm(stagingDir, { recursive: true, force: true });
    console.error(`[watch] Build failed after ${Math.round(performance.now() - startedAt)}ms; serving the last successful build.`);
    return;
  }

  await publishBuild();
  log(`build completed in ${Math.round(performance.now() - startedAt)}ms`);
  if (serve) browser.reload();
}

async function drainBuildQueue() {
  if (building || stopping) return;
  building = true;
  try {
    while (pendingPaths.size > 0 && !stopping) {
      const changedPaths = [...pendingPaths];
      pendingPaths.clear();
      await buildOnce(changedPaths);
    }
  } finally {
    building = false;
  }
}

function scheduleBuild(changedPath: string) {
  pendingPaths.add(changedPath);
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => void drainBuildQueue(), 150);
}

const watcher = chokidar.watch(["src", "content"], {
  atomic: true,
  awaitWriteFinish: { stabilityThreshold: 100, pollInterval: 25 },
  ignoreInitial: true,
});

watcher.on("all", (event, changedPath) => {
  log(`${event}: ${changedPath}`);
  scheduleBuild(changedPath);
});
watcher.on("error", (error) => console.error("[watch] Watcher error:", error));

if (serve) {
  const port = Number(process.env.PORT ?? 3000);
  await browser.init({
    server: { baseDir: outputDir },
    port,
    open: false,
    ui: false,
    notify: false,
    ghostMode: false,
  });
  log(`serving ${outputDir} at http://localhost:${port}`);
}

await new Promise<void>((resolve) => watcher.once("ready", resolve));
scheduleBuild("initial build");

async function shutdown(signal: string) {
  if (stopping) return;
  stopping = true;
  if (debounceTimer) clearTimeout(debounceTimer);
  log(`received ${signal}; shutting down`);
  await watcher.close();
  if (activeBuild) {
    activeBuild.kill();
    await activeBuild.exited;
  }
  if (serve) browser.exit();
  await rm(stagingDir, { recursive: true, force: true });
  process.exit(0);
}

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));
