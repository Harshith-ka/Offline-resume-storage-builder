"use client";

import { Type, List, BarChart3, GitBranch, Briefcase, FolderKanban, Layout } from "lucide-react";
import type { BlockType, ResumeBlock } from "@/types/resume";
import { useEditorStore } from "@/store/editor-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BLOCK_DEFS: { type: BlockType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { type: "heading", label: "Heading", icon: Type },
  { type: "paragraph", label: "Paragraph", icon: Type },
  { type: "bulletList", label: "Bullet list", icon: List },
  { type: "skillMeter", label: "Skill bar", icon: BarChart3 },
  { type: "timeline", label: "Timeline", icon: GitBranch },
  { type: "section", label: "Section", icon: Layout },
  { type: "projectCard", label: "Project card", icon: FolderKanban },
  { type: "internshipCard", label: "Internship card", icon: Briefcase },
];

function createBlock(type: BlockType): ResumeBlock {
  const id = `block_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const base = { id, x: 80, y: 80, width: 300, height: 40, zIndex: 100 };
  switch (type) {
    case "heading":
      return { ...base, type: "heading", text: "Heading", level: 1 };
    case "paragraph":
      return { ...base, type: "paragraph", text: "Paragraph text.", height: 60 };
    case "bulletList":
      return { ...base, type: "bulletList", items: ["Bullet 1", "Bullet 2"], height: 80 };
    case "skillMeter":
      return { ...base, type: "skillMeter", label: "Skill", value: 75, height: 28 };
    case "timeline":
      return {
        ...base,
        type: "timeline",
        title: "Section",
        items: [{ title: "Item", period: "Date" }],
        height: 100,
      };
    case "section":
      return { ...base, type: "section", title: "Section", height: 32 };
    case "projectCard":
      return {
        ...base,
        type: "projectCard",
        title: "Project",
        role: "Role",
        period: "Date",
        bullets: ["Impact bullet"],
        tech: ["Tech"],
        height: 140,
      };
    case "internshipCard":
      return {
        ...base,
        type: "internshipCard",
        company: "Company",
        role: "Role",
        period: "Date",
        bullets: ["Achievement"],
        height: 120,
      };
    default:
      return { ...base, type: "heading", text: "Block", level: 1 };
  }
}

export function BlockPalette() {
  const addBlock = useEditorStore((s) => s.addBlock);

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Add block
      </h3>
      <div className="grid grid-cols-2 gap-1.5">
        {BLOCK_DEFS.map(({ type, label, icon: Icon }) => (
          <Button
            key={type}
            variant="ghost"
            size="sm"
            className="justify-start gap-2"
            onClick={() => addBlock(createBlock(type))}
          >
            <Icon className="size-4 shrink-0" />
            <span className="truncate">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
