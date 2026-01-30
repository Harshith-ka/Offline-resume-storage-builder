"use client";

import type { TimelineBlock as TimelineBlockType } from "@/types/resume";
import { cn } from "@/lib/utils";

interface Props {
  block: TimelineBlockType;
  selected?: boolean;
  scale?: number;
  onSelect?: () => void;
  readOnly?: boolean;
}

export function TimelineBlock({
  block,
  selected,
  scale = 1,
  onSelect,
  readOnly,
}: Props) {
  const fontSize = 11 * scale;

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
      {block.title && (
        <h4 className="mb-2 text-sm font-semibold text-gray-900" style={{ fontSize: 12 * scale }}>
          {block.title}
        </h4>
      )}
      <div className="space-y-3">
        {block.items.map((item, i) => (
          <div key={i} className="flex gap-3" style={{ fontSize: `${fontSize}px` }}>
            <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
            <div>
              <div className="font-medium text-gray-900">{item.title}</div>
              {item.subtitle && <div className="text-gray-600">{item.subtitle}</div>}
              {item.period && <div className="text-gray-500">{item.period}</div>}
              {item.description && <div className="mt-0.5 text-gray-700">{item.description}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
