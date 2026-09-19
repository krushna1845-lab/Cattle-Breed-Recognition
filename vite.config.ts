import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";

function stripPackageVersions(): Plugin {
  const versionedSpecifier = /^(@?[^@]+)@(\d+\.\d+\.\d+.*)$/;

  return {
    name: "strip-package-versions",
    enforce: "pre",
    resolveId(source) {
      const match = source.match(versionedSpecifier);
      if (match) {
        return this.resolve(match[1], undefined, { skipSelf: true });
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), stripPackageVersions()],
});