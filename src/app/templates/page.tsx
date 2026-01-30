"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, GraduationCap, Briefcase, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { templates, templateCategories } from "@/data/templates";
import type { TemplateCategory } from "@/types/resume";
import { cn } from "@/lib/utils";

const categoryIcons: Record<TemplateCategory, React.ComponentType<{ className?: string }>> = {
  student: GraduationCap,
  internship: Briefcase,
  fresher: User,
  professional: Briefcase,
};

export default function TemplatesPage() {
  const [category, setCategory] = useState<TemplateCategory | "all">("all");
  const filtered =
    category === "all"
      ? templates
      : templates.filter((t) => t.category === category);

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-20 border-b border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-foreground">
            <ArrowLeft className="size-5" />
            <span className="font-semibold">Resume Forge</span>
          </Link>
          <Link href="/editor">
            <Button>Open Editor</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold tracking-tight">
            Choose a template
          </h1>
          <p className="mt-2 text-muted-foreground">
            Student, fresher, or professional — pick one and customize on the
            canvas.
          </p>
        </motion.div>

        <div className="mb-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={cn(
              "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
              category === "all"
                ? "border-primary bg-primary/20 text-primary"
                : "border-border bg-transparent text-muted-foreground hover:bg-muted"
            )}
          >
            All
          </button>
          {templateCategories.map((cat) => {
            const Icon = categoryIcons[cat.id];
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                  category === cat.id
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-border bg-transparent text-muted-foreground hover:bg-muted"
                )}
              >
                {Icon && <Icon className="size-4" />}
                {cat.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={category}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((template, i) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group"
              >
                <Link
                  href={`/editor?template=${template.id}`}
                  className="block rounded-2xl border border-border bg-card p-0 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="aspect-[210/297] overflow-hidden rounded-t-2xl bg-muted/30 p-4">
                    <div
                      className="mx-auto h-full w-full max-w-[200px] rounded bg-white shadow-lg"
                      style={{
                        transform: "scale(0.35)",
                        transformOrigin: "top left",
                        width: "285%",
                        height: "285%",
                      }}
                    >
                      <TemplatePreviewBlocks blocks={template.document.pages[0]?.blocks ?? []} />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                    <span className="mt-3 inline-block text-sm text-primary">
                      Use template →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function TemplatePreviewBlocks({ blocks }: { blocks: typeof templates[0]["document"]["pages"][0]["blocks"] }) {
  return (
    <div className="flex h-full flex-col gap-1 p-3 text-[8px] text-gray-800">
      {blocks.slice(0, 6).map((b) => (
        <div key={b.id} className="h-3 w-full rounded bg-gray-200" />
      ))}
    </div>
  );
}
