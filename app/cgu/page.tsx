import { readFile } from "node:fs/promises";
import { join } from "node:path";
import LegalMarkdown from "@/app/components/LegalMarkdown";

export default async function CGUPage() {
  const cguPath = join(process.cwd(), "CGU Locars_01.05.2026.md");
  const cguContent = await readFile(cguPath, "utf8");
  const cguContentWithoutTopTitle = cguContent
    .replace(/^#\s+.+\r?\n?/, "")
    .trimStart();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <main className="mx-auto max-w-6xl px-6 md:px-12 py-16 md:py-24">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-end">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-blue-300/70">Juridique</p>
            <h1 className="max-w-full whitespace-nowrap text-[clamp(1.35rem,5.2vw,3.75rem)] font-black leading-[0.95] tracking-tight bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">
              Conditions Générales d’Utilisation
            </h1>
          </div>
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:p-10 shadow-2xl shadow-black/20 backdrop-blur-sm">
          <LegalMarkdown content={cguContentWithoutTopTitle} />
        </section>
      </main>
    </div>
  );
}
