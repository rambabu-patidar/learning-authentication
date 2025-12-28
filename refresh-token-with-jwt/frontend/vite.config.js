import { defineConfig } from "vite";
import fs from "fs";
import path from "path";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

// https://vite.dev/config/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default defineConfig({
	plugins: [react()],
	server: {
		https: {
			key: fs.readFileSync(path.resolve(__dirname, "cert/key.pem")),
			cert: fs.readFileSync(path.resolve(__dirname, "cert/cert.pem")),
		},
		port: 5173,
	},
});
