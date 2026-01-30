"use client";

import type { SkillMeterBlock as SkillMeterBlockType } from "@/types/resume";
import { cn } from "@/lib/utils";

interface Props {
  block: SkillMeterBlockType;
  selected?: boolean;
  scale?: number;
  onSelect?: () => void;
  onUpdate?: (label: string, value: number) => void;
  readOnly?: boolean;
}

export function SkillMeterBlock({
  block,
  selected,
  scale = 1,
  onSelect,
  onUpdate,
  readOnly,
}: Props) {
  const barColor = block.color ?? "hsl(263 70% 58%)";

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
      <div className="flex items-center gap-2">
        {readOnly ? (
          <span className="shrink-0 text-sm font-medium text-gray-800" style={{ minWidth: 80 }}>
            {block.label}
          </span>
        ) : (
          <input
            type="text"
            value={block.label}
            onChange={(e) => onUpdate?.(e.target.value, block.value)}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-20 shrink-0 bg-transparent text-sm font-medium outline-none"
            placeholder="Skill"
          />
        )}
        <div className="flex-1 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full transition-[width]"
            style={{
              width: `${Math.min(100, Math.max(0, block.value))}%`,
              backgroundColor: barColor,
            }}
          />
        </div>
        {!readOnly && (
          <input
            type="number"
            min={0}
            max={100}
            value={block.value}
            onChange={(e) => onUpdate?.(block.label, Number(e.target.value))}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-10 bg-transparent text-right text-sm outline-none"
          />
        )}
      </div>
    </div>
  );
}
