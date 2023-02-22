import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
// import { process } from "@types/node";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    // eslint-disable-next-line no-undef
    fastRefresh: process.env.NODE_ENV !== 'test'
  }), eslint()],
});
