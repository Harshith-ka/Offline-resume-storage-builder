"use client";

import type { BulletListBlock as BulletListBlockType } from "@/types/resume";
import { cn } from "@/lib/utils";

interface Props {
  block: BulletListBlockType;
  selected?: boolean;
  scale?: number;
  onSelect?: () => void;
  onUpdate?: (items: string[]) => void;
  readOnly?: boolean;
}

export function BulletListBlock({
  block,
  selected,
  scale = 1,
  onSelect,
  onUpdate,
  readOnly,
}: Props) {
  const fontSize = (block.fontSize ?? 11) * scale;
  const items = block.items?.length ? block.items : [""];

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
      <ul
        className="list-disc space-y-1 pl-4"
        style={{
          fontSize: `${fontSize}px`,
          fontFamily: block.fontFamily ?? "inherit",
          color: block.color ?? "#333",
        }}
      >
        {items.map((item, i) =>
          readOnly ? (
            <li key={i}>{item || "•"}</li>
          ) : (
            <li key={i}>
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = e.target.value;
                  onUpdate?.(next);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-full bg-transparent outline-none"
                placeholder="Bullet"
              />
            </li>
          )
        )}
      </ul>
    </div>
  );
}
