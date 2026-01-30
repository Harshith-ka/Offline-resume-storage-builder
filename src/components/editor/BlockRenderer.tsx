"use client";

import type { ResumeBlock } from "@/types/resume";
import { HeadingBlock } from "./blocks/HeadingBlock";
import { ParagraphBlock } from "./blocks/ParagraphBlock";
import { BulletListBlock } from "./blocks/BulletListBlock";
import { SkillMeterBlock } from "./blocks/SkillMeterBlock";
import { TimelineBlock } from "./blocks/TimelineBlock";
import { SectionBlock } from "./blocks/SectionBlock";
import { ProjectCardBlock } from "./blocks/ProjectCardBlock";
import { InternshipCardBlock } from "./blocks/InternshipCardBlock";

interface Props {
  block: ResumeBlock;
  selected?: boolean;
  scale?: number;
  onSelect?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<ResumeBlock>) => void;
  readOnly?: boolean;
}

export function BlockRenderer({
  block,
  selected,
  scale = 1,
  onSelect,
  onUpdate,
  readOnly,
}: Props) {
  const handleUpdate = (updates: Partial<ResumeBlock>) => onUpdate?.(block.id, updates);

  switch (block.type) {
    case "heading":
      return (
        <HeadingBlock
          block={block}
          selected={selected}
          scale={scale}
          onSelect={() => onSelect?.(block.id)}
          onUpdate={(text) => handleUpdate({ text })}
          readOnly={readOnly}
        />
      );
    case "paragraph":
      return (
        <ParagraphBlock
          block={block}
          selected={selected}
          scale={scale}
          onSelect={() => onSelect?.(block.id)}
          onUpdate={(text) => handleUpdate({ text })}
          readOnly={readOnly}
        />
      );
    case "bulletList":
      return (
        <BulletListBlock
          block={block}
          selected={selected}
          scale={scale}
          onSelect={() => onSelect?.(block.id)}
          onUpdate={(items) => handleUpdate({ items })}
          readOnly={readOnly}
        />
      );
    case "skillMeter":
      return (
        <SkillMeterBlock
          block={block}
          selected={selected}
          scale={scale}
          onSelect={() => onSelect?.(block.id)}
          onUpdate={(label, value) => handleUpdate({ label, value })}
          readOnly={readOnly}
        />
      );
    case "timeline":
      return (
        <TimelineBlock
          block={block}
          selected={selected}
          scale={scale}
          onSelect={() => onSelect?.(block.id)}
          readOnly={readOnly}
        />
      );
    case "section":
      return (
        <SectionBlock
          block={block}
          selected={selected}
          scale={scale}
          onSelect={() => onSelect?.(block.id)}
          onUpdate={(title) => handleUpdate({ title })}
          readOnly={readOnly}
        />
      );
    case "projectCard":
      return (
        <ProjectCardBlock
          block={block}
          selected={selected}
          scale={scale}
          onSelect={() => onSelect?.(block.id)}
          readOnly={readOnly}
        />
      );
    case "internshipCard":
      return (
        <InternshipCardBlock
          block={block}
          selected={selected}
          scale={scale}
          onSelect={() => onSelect?.(block.id)}
          readOnly={readOnly}
        />
      );
    default:
      return null;
  }
}
