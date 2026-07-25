#!/usr/bin/env node
/**
 * Local smoke check for PWA + Digital Asset Links files.
 * Usage: node android-twa/verify-pwa.mjs [baseUrl]
 * Default baseUrl: http://localhost:3000
 */
const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");

const paths = [
  "/manifest.webmanifest",
  "/sw.js",
  "/.well-known/assetlinks.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
  "/icons/apple-touch-icon.png",
];

async function main() {
  let failed = 0;
  for (const path of paths) {
    const url = `${base}${path}`;
    try {
      const res = await fetch(url);
      const ok = res.status === 200;
      if (!ok) failed += 1;
      console.log(`${ok ? "OK" : "FAIL"} ${res.status} ${url}`);
      if (path.endsWith(".json") && ok) {
        const json = await res.json();
        if (!Array.isArray(json) || !json[0]?.target?.package_name) {
          console.log("  WARN: assetlinks shape unexpected");
          failed += 1;
        } else {
          console.log(`  package: ${json[0].target.package_name}`);
        }
      }
      if (path.endsWith(".webmanifest") && ok) {
        const json = await res.json();
        console.log(`  name: ${json.name}; display: ${json.display}`);
      }
    } catch (err) {
      failed += 1;
      console.log(`FAIL  --- ${url} (${err.message})`);
    }
  }
  if (failed) {
    console.error(`\n${failed} check(s) failed`);
    process.exit(1);
  }
  console.log("\nAll PWA/TWA static checks passed.");
}

main();
