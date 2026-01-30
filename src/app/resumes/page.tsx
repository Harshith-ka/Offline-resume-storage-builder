"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Copy, Trash2, Plus, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllResumes, deleteResume, duplicateResume, type StoredResume } from "@/lib/db";
import { useEditorStore } from "@/store/editor-store";

export default function ResumesPage() {
  const [resumes, setResumes] = useState<StoredResume[]>([]);
  const [loading, setLoading] = useState(true);
  const setDocument = useEditorStore((s) => s.setDocument);

  useEffect(() => {
    getAllResumes().then((list) => {
      setResumes(list);
      setLoading(false);
    });
  }, []);

  const handleOpen = (r: StoredResume) => {
    setDocument(r.document);
    window.location.href = "/editor";
  };

  const handleDuplicate = async (id: string) => {
    try {
      const newDoc = await duplicateResume(id);
      setResumes((prev) => [
        { id: newDoc.id, name: newDoc.name, document: newDoc, updatedAt: newDoc.updatedAt },
        ...prev,
      ]);
      setDocument(newDoc);
      window.location.href = "/editor";
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this resume? This cannot be undone.")) return;
    await deleteResume(id);
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-5" />
            <span className="font-semibold">Resume Forge</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/templates">
              <Button variant="ghost" size="sm">
                <FolderOpen className="size-4" />
                Templates
              </Button>
            </Link>
            <Link href="/editor">
              <Button size="sm">
                <Plus className="size-4" />
                New resume
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold tracking-tight">My Resumes</h1>
          <p className="mt-2 text-muted-foreground">
            Stored locally. Edit offline, duplicate for different roles, export when ready.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-muted-foreground">Loading…</div>
        ) : resumes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-2xl border border-dashed border-border p-12 text-center"
          >
            <FileText className="mx-auto size-12 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-semibold">No resumes yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Create one from a template or start with a blank canvas.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/templates">
                <Button variant="outline">Pick a template</Button>
              </Link>
              <Link href="/editor">
                <Button>Blank canvas</Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass group rounded-xl border border-border p-4 transition-all hover:border-primary/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold">{r.name}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Updated {new Date(r.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => handleOpen(r)}
                      aria-label="Open"
                    >
                      <FolderOpen className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => handleDuplicate(r.id)}
                      aria-label="Duplicate"
                    >
                      <Copy className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(r.id)}
                      aria-label="Delete"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  className="mt-3 w-full"
                  size="sm"
                  variant="secondary"
                  onClick={() => handleOpen(r)}
                >
                  Open in editor
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
