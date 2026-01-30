"use client";

import type { HeadingBlock as HeadingBlockType } from "@/types/resume";
import { cn } from "@/lib/utils";

interface Props {
  block: HeadingBlockType;
  selected?: boolean;
  scale?: number;
  onSelect?: () => void;
  onUpdate?: (text: string) => void;
  readOnly?: boolean;
}

export function HeadingBlock({
  block,
  selected,
  scale = 1,
  onSelect,
  onUpdate,
  readOnly,
}: Props) {
  const sizeMap = { 1: 24, 2: 20, 3: 16 };
  const fontSize = (block.fontSize ?? sizeMap[block.level]) * scale;
  const Tag = `h${block.level}` as "h1" | "h2" | "h3";

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
      onKeyDown={(e) => e.key === "Enter" && onSelect?.()}
    >
      {readOnly ? (
        <Tag
          className="truncate font-semibold text-gray-900"
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: block.fontFamily ?? "inherit",
            color: block.color ?? "#111",
          }}
        >
          {block.text || "Heading"}
        </Tag>
      ) : (
        <input
          type="text"
          value={block.text}
          onChange={(e) => onUpdate?.(e.target.value)}
          onPointerDown={(e) => e.stopPropagation()}
          className="h-full w-full truncate rounded bg-transparent font-semibold outline-none"
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: block.fontFamily ?? "inherit",
            color: block.color ?? "#111",
          }}
          placeholder="Heading"
        />
      )}
    </div>
  );
}
