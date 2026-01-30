"use client";

import type { SectionBlock as SectionBlockType } from "@/types/resume";
import { cn } from "@/lib/utils";

interface Props {
  block: SectionBlockType;
  selected?: boolean;
  scale?: number;
  onSelect?: () => void;
  onUpdate?: (title: string) => void;
  readOnly?: boolean;
}

export function SectionBlock({
  block,
  selected,
  scale = 1,
  onSelect,
  onUpdate,
  readOnly,
}: Props) {
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
      {readOnly ? (
        <h3 className="border-b-2 border-primary pb-1 text-sm font-bold uppercase tracking-wide text-gray-900">
          {block.title}
        </h3>
      ) : (
        <input
          type="text"
          value={block.title}
          onChange={(e) => onUpdate?.(e.target.value)}
          onPointerDown={(e) => e.stopPropagation()}
          className="w-full border-b-2 border-primary bg-transparent pb-1 text-sm font-bold uppercase tracking-wide outline-none"
          placeholder="Section"
        />
      )}
    </div>
  );
}
