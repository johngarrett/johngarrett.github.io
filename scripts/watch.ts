import { watch } from "fs";

let rebuilding = false;
let pending = false;

async function rebuild(): Promise<void> {
  if (rebuilding) {
    pending = true;
    return;
  }
  rebuilding = true;
  pending = false;
  console.log("[watch] rebuilding...");
  const proc = Bun.spawn(["bun", "run", "src/main.ts"], {
    stdio: ["inherit", "inherit", "inherit"],
    cwd: import.meta.dir + "/..",
  });
  await proc.exited;
  rebuilding = false;
  if (pending) rebuild();
}

let debounce: ReturnType<typeof setTimeout> | null = null;
function scheduleRebuild() {
  if (debounce) clearTimeout(debounce);
  debounce = setTimeout(rebuild, 100);
}

await rebuild();

for (const dir of ["src", "content"]) {
  watch(import.meta.dir + "/../" + dir, { recursive: true }, (_, filename) => {
    console.log(`[watch] ${dir}/${filename} changed`);
    scheduleRebuild();
  });
}

console.log("[watch] watching src/ and content/ for changes...");
await new Promise(() => {});
