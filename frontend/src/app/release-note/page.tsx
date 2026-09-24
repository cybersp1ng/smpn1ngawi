import type { Metadata } from "next";
import ReleaseNote from "@/content/release-note.mdx";

export const metadata: Metadata = {
  title: "Release Note",
  description: "Catatan pembaruan situs resmi SMP Negeri 1 Ngawi.",
};

export default function ReleaseNotePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="prose prose-slate max-w-none prose-headings:text-[#1E2B7A] prose-a:text-[#0097DF]">
          <ReleaseNote />
        </div>
      </div>
    </article>
  );
}
