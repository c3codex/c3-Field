import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
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
  const c3FieldR2PublicBaseUrl =
    process.env.VITE_C3FIELD_R2_PUBLIC_BASE_URL ||
    env.VITE_C3FIELD_R2_PUBLIC_BASE_URL ||
    cloudflareEnv.VITE_C3FIELD_R2_PUBLIC_BASE_URL ||
    ""
  const inannaStaticIdentity = {
    title: "Measures of Inanna",
    description: "A ceremonial exhibition of sacred measure & immutable memory.",
    url: "https://www.measuresofinanna.com/",
    image: "/og.png",
    manifest: "/manifest.inanna.json",
  }
  const inannaManifest = JSON.stringify(
    {
      name: inannaStaticIdentity.title,
      short_name: "Measures",
      description: inannaStaticIdentity.description,
      start_url: "/",
      display: "standalone",
    },
    null,
    2,
  )

  return {
    plugins: [
      react(),
      {
        name: "inanna-static-public-identity",
        transformIndexHtml(html) {
          if (mode !== "inanna") return html

          return html
            .replace(/<title>.*?<\/title>/, `<title>${inannaStaticIdentity.title}</title>`)
            .replace(
              /(<meta\s+name="description"\s+content=")[^"]*("\s*\/>)/,
              `$1${inannaStaticIdentity.description}$2`,
            )
            .replace(
              /(<link\s+rel="manifest"\s+href=")[^"]*("\s*\/>)/,
              `$1${inannaStaticIdentity.manifest}$2`,
            )
            .replace(
              /(<meta\s+property="og:title"\s+content=")[^"]*("\s*\/>)/,
              `$1${inannaStaticIdentity.title}$2`,
            )
            .replace(
              /(<meta\s+property="og:description"\s+content=")[^"]*("\s*\/>)/,
              `$1${inannaStaticIdentity.description}$2`,
            )
            .replace(
              /(<meta\s+property="og:url"\s+content=")[^"]*("\s*\/>)/,
              `$1${inannaStaticIdentity.url}$2`,
            )
            .replace(
              /(<meta\s+property="og:image"\s+content=")[^"]*("\s*\/>)/,
              `$1${inannaStaticIdentity.image}$2`,
            )
            .replace(
              /(<meta\s+name="twitter:title"\s+content=")[^"]*("\s*\/>)/,
              `$1${inannaStaticIdentity.title}$2`,
            )
            .replace(
              /(<meta\s+name="twitter:description"\s+content=")[^"]*("\s*\/>)/,
              `$1${inannaStaticIdentity.description}$2`,
            )
            .replace(
              /(<meta\s+name="twitter:image"\s+content=")[^"]*("\s*\/>)/,
              `$1${inannaStaticIdentity.image}$2`,
            )
        },
        writeBundle(options) {
          if (mode !== "inanna") return

          const outputDir = options.dir ? path.resolve(options.dir) : path.resolve("dist-inanna")
          fs.writeFileSync(path.join(outputDir, "manifest.json"), `${inannaManifest}\n`)
          fs.writeFileSync(path.join(outputDir, "site.webmanifest"), `${inannaManifest}\n`)
          fs.writeFileSync(
            path.join(outputDir, "robots.txt"),
            "User-agent: *\nAllow: /\n\nSitemap: https://www.measuresofinanna.com/sitemap.xml\n",
          )
          fs.writeFileSync(
            path.join(outputDir, "sitemap.xml"),
            [
              '<?xml version="1.0" encoding="UTF-8"?>',
              '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
              "  <url>",
              `    <loc>${inannaStaticIdentity.url}</loc>`,
              "  </url>",
              "</urlset>",
              "",
            ].join("\n"),
          )
          fs.writeFileSync(
            path.join(outputDir, "llms.txt"),
            [
              "# Measures of Inanna",
              "",
              `> ${inannaStaticIdentity.description}`,
              "",
              "Measures of Inanna is the public Inanna Temple surface for sacred measure and immutable memory.",
              "",
              `- [Measures of Inanna](${inannaStaticIdentity.url}): public Temple surface.`,
              "",
            ].join("\n"),
          )
        },
      },
    ],
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(supabaseUrl),
      "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(supabaseAnonKey),
      "import.meta.env.VITE_R2_PUBLIC_BASE_URL": JSON.stringify(r2PublicBaseUrl),
      "import.meta.env.VITE_C3FIELD_R2_PUBLIC_BASE_URL": JSON.stringify(c3FieldR2PublicBaseUrl),
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
