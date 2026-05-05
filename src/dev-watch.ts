import { watch } from "fs";

let proc: ReturnType<typeof Bun.spawn> | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

async function rebuild() {
  if (proc) {
    proc.kill();
    await proc.exited;
  }
  proc = Bun.spawn(["bun", "run", "src/main.ts"], {
    stdout: "inherit",
    stderr: "inherit",
  });
}

function scheduleRebuild(changedPath: string) {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    console.log(`[watch] ${changedPath} changed, rebuilding...`);
    await rebuild();
  }, 100);
}

await rebuild();

for (const dir of ["src", "content"]) {
  watch(dir, { recursive: true }, (_event, filename) => {
    scheduleRebuild(`${dir}/${filename}`);
  });
}
