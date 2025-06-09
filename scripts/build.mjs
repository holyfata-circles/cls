import Bun from "bun";
import path from "node:path";
import dts from "bun-plugin-dts";

await Bun.build({
  entrypoints: [path.join(import.meta.dirname, "../src/index.ts")],
  outdir: path.join(import.meta.dirname, "../dist"),
  target: "browser",
  format: "esm",
  sourcemap: "linked",
  minify: true,
  external: ["react", "react-dom"],
  plugins: [dts()],
});
