"use client";

import type { ParagraphBlock as ParagraphBlockType } from "@/types/resume";
import { cn } from "@/lib/utils";

interface Props {
  block: ParagraphBlockType;
  selected?: boolean;
  scale?: number;
  onSelect?: () => void;
  onUpdate?: (text: string) => void;
  readOnly?: boolean;
}

export function ParagraphBlock({
  block,
  selected,
  scale = 1,
  onSelect,
  onUpdate,
  readOnly,
}: Props) {
  const fontSize = (block.fontSize ?? 12) * scale;

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
        <p
          className="overflow-hidden text-ellipsis text-gray-800"
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: block.fontFamily ?? "inherit",
            color: block.color ?? "#333",
          }}
        >
          {block.text || "Paragraph"}
        </p>
      ) : (
        <textarea
          value={block.text}
          onChange={(e) => onUpdate?.(e.target.value)}
          onPointerDown={(e) => e.stopPropagation()}
          className="h-full w-full resize-none rounded bg-transparent outline-none"
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: block.fontFamily ?? "inherit",
            color: block.color ?? "#333",
          }}
          placeholder="Paragraph"
        />
      )}
    </div>
  );
}
