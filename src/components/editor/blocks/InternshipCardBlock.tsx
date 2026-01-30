"use client";

import type { InternshipCardBlock as InternshipCardBlockType } from "@/types/resume";
import { cn } from "@/lib/utils";

interface Props {
  block: InternshipCardBlockType;
  selected?: boolean;
  scale?: number;
  onSelect?: () => void;
  readOnly?: boolean;
}

export function InternshipCardBlock({
  block,
  selected,
  scale = 1,
  onSelect,
  readOnly,
}: Props) {
  const fontSize = 10 * scale;

  return (
    <div
      className={cn(
        "absolute cursor-pointer rounded border-2 transition-colors",
        selected ? "border-primary ring-2 ring-primary/30" : "border-transparent hover:border-muted-foreground/30"
      )}
      style={{
        left: block.x * scale,
        top: block.y * scale,
        width: block.width * scale,
        height: block.height * scale,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      role="button"
      tabIndex={0}
    >
      <div className="text-gray-800" style={{ fontSize: `${fontSize}px` }}>
        <div className="font-semibold">{block.role} — {block.company}</div>
        <div className="text-gray-600">{block.period}</div>
        <ul className="mt-1 list-disc space-y-0.5 pl-4">
          {block.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
