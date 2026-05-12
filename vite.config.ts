import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { config as loadDotenv } from "dotenv";

const PUBLIC_SUPABASE_URL = "https://zfihrspxvennjzazxcbj.supabase.co"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const cloudflareEnv =
    loadDotenv({
      path: path.resolve(process.cwd(), ".env.cloudflare"),
      processEnv: {},
      quiet: true,
    }).parsed ?? {}
  const supabaseUrl =
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    cloudflareEnv.VITE_SUPABASE_URL ||
    env.VITE_SUPABASE_URL ||
    env.SUPABASE_URL ||
    PUBLIC_SUPABASE_URL
  const supabaseAnonKey =
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    cloudflareEnv.VITE_SUPABASE_ANON_KEY ||
    env.VITE_SUPABASE_ANON_KEY ||
    env.SUPABASE_ANON_KEY ||
    ""
  const r2PublicBaseUrl =
    process.env.VITE_R2_PUBLIC_BASE_URL ||
    env.VITE_R2_PUBLIC_BASE_URL ||
    cloudflareEnv.VITE_R2_PUBLIC_BASE_URL ||
    ""

  return {
    plugins: [react()],
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(supabaseUrl),
      "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(supabaseAnonKey),
      "import.meta.env.VITE_R2_PUBLIC_BASE_URL": JSON.stringify(r2PublicBaseUrl),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@pillars": path.resolve(__dirname, "./src/pillars"),
        "@systems": path.resolve(__dirname, "./src/systems"),
        "@shared": path.resolve(__dirname, "./src/pillars/shared"),
        "@structure": path.resolve(__dirname, "./src/structure"),
      },
    },
  }
});
