import { watch } from "fs";

let proc: ReturnType<typeof Bun.spawn> | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function printControls() {
  process.stdout.write("\n  [x] exit   [l] clear\n");
}

async function rebuild() {
  if (proc) {
    proc.kill();
    await proc.exited;
  }
  proc = Bun.spawn(["bun", "run", "src/main.ts"], {
    stdout: "inherit",
    stderr: "inherit",
  });
  await proc.exited;
  printControls();
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

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf8");

process.stdin.on("data", (key: string) => {
  if (key === "x" || key === "") {
    if (proc) proc.kill();
    process.exit(0);
  }
  if (key === "l") {
    console.clear();
    printControls();
  }
});
