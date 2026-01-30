"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileDown, Image, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editor-store";
import { saveResume } from "@/lib/db";

export default function ExportPage() {
  const resumeDoc = useEditorStore((s) => s.document);
  const [status, setStatus] = useState<"idle" | "exporting" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const exportPdf = async () => {
    setStatus("exporting");
    setMessage("");
    try {
      const { jsPDF } = await import("jspdf");
      const doc = useEditorStore.getState().document;
      await saveResume(doc);
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      pdf.setFont("helvetica");
      const page = doc.pages[0];
      if (!page) {
        setStatus("error");
        setMessage("No content to export.");
        return;
      }
      const margin = page.margin ?? 48;
      let y = margin + 20;
      for (const block of page.blocks) {
        if (block.type === "heading") {
          pdf.setFontSize(block.level === 1 ? 20 : block.level === 2 ? 16 : 14);
          pdf.text(block.text || "Heading", margin, y);
          y += 24;
        } else if (block.type === "paragraph") {
          pdf.setFontSize(11);
          const lines = pdf.splitTextToSize(block.text || "", page.width - 2 * margin);
          pdf.text(lines, margin, y);
          y += lines.length * 14 + 8;
        } else if (block.type === "section") {
          pdf.setFontSize(12);
          pdf.setFont("helvetica", "bold");
          pdf.text(block.title, margin, y);
          pdf.setFont("helvetica", "normal");
          y += 18;
        } else if (block.type === "bulletList") {
          pdf.setFontSize(10);
          for (const item of block.items || []) {
            pdf.text(`• ${item}`, margin, y);
            y += 12;
          }
          y += 6;
        } else if (block.type === "skillMeter") {
          pdf.setFontSize(10);
          pdf.text(`${block.label}: ${block.value}%`, margin, y);
          y += 14;
        } else if (block.type === "timeline") {
          pdf.setFontSize(10);
          for (const item of block.items || []) {
            pdf.text(`${item.title} — ${item.period || ""}`, margin, y);
            y += 12;
            if (item.description) {
              const descLines = pdf.splitTextToSize(item.description, page.width - 2 * margin - 20);
              pdf.text(descLines, margin + 10, y);
              y += descLines.length * 10 + 6;
            }
          }
          y += 8;
        } else if (block.type === "projectCard") {
          pdf.setFontSize(11);
          pdf.setFont("helvetica", "bold");
          pdf.text(block.title, margin, y);
          pdf.setFont("helvetica", "normal");
          y += 14;
          for (const b of block.bullets || []) {
            pdf.setFontSize(9);
            pdf.text(`• ${b}`, margin + 8, y);
            y += 10;
          }
          y += 8;
        } else if (block.type === "internshipCard") {
          pdf.setFontSize(11);
          pdf.text(`${block.role} — ${block.company}`, margin, y);
          y += 12;
          for (const b of block.bullets || []) {
            pdf.setFontSize(9);
            pdf.text(`• ${b}`, margin + 8, y);
            y += 10;
          }
          y += 8;
        }
        if (y > page.height - margin) {
          pdf.addPage();
          y = margin + 20;
        }
      }
      pdf.save(`${doc.name.replace(/\s+/g, "_")}.pdf`);
      setStatus("done");
      setMessage("PDF downloaded.");
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Export failed.");
    }
  };

  const exportPng = async () => {
    setStatus("exporting");
    setMessage("");
    try {
      const canvas = typeof window !== "undefined" ? window.document.getElementById("resume-canvas-export") as HTMLCanvasElement | null : null;
      if (!canvas) {
        setStatus("error");
        setMessage("Canvas not found. Use Export PDF for now.");
        return;
      }
      const link = typeof window !== "undefined" ? window.document.createElement("a") : null;
      if (!link) return;
      link.download = `${resumeDoc.name.replace(/\s+/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setStatus("done");
      setMessage("PNG downloaded.");
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Export failed.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/editor" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-5" />
            Back to editor
          </Link>
          <span className="font-semibold">Export</span>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-2xl font-bold">Export resume</h1>
        <p className="mt-2 text-muted-foreground">
          Download as PDF (ATS-optimized) or PNG preview. DOCX coming soon.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button onClick={exportPdf} disabled={status === "exporting"} size="lg">
            <FileText className="size-5" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={exportPng} disabled={status === "exporting"} size="lg">
            <Image className="size-5" />
            Export PNG
          </Button>
        </div>
        {status === "exporting" && <p className="mt-4 text-sm text-muted-foreground">Exporting…</p>}
        {status === "done" && <p className="mt-4 text-sm text-primary">{message}</p>}
        {status === "error" && <p className="mt-4 text-sm text-destructive">{message}</p>}
      </main>
    </div>
  );
}
