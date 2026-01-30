/**
 * Resume & canvas types for the editor.
 * Blocks are the atomic units on the canvas (Canva-style).
 */

export type BlockType =
  | "heading"
  | "paragraph"
  | "bulletList"
  | "skillMeter"
  | "timeline"
  | "projectCard"
  | "internshipCard"
  | "section";

export interface BaseBlock {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  zIndex: number;
}

export interface HeadingBlock extends BaseBlock {
  type: "heading";
  text: string;
  level: 1 | 2 | 3;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
}

export interface ParagraphBlock extends BaseBlock {
  type: "paragraph";
  text: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
}

export interface BulletListBlock extends BaseBlock {
  type: "bulletList";
  items: string[];
  fontFamily?: string;
  fontSize?: number;
  color?: string;
}

export interface SkillMeterBlock extends BaseBlock {
  type: "skillMeter";
  label: string;
  value: number; // 0–100
  color?: string;
}

export interface TimelineItem {
  title: string;
  subtitle?: string;
  period?: string;
  description?: string;
}

export interface TimelineBlock extends BaseBlock {
  type: "timeline";
  title?: string; // section title e.g. "Education", "Experience"
  items: TimelineItem[];
  fontFamily?: string;
}

export interface ProjectCardBlock extends BaseBlock {
  type: "projectCard";
  title: string;
  role?: string;
  period?: string;
  bullets: string[];
  tech?: string[];
}

export interface InternshipCardBlock extends BaseBlock {
  type: "internshipCard";
  company: string;
  role: string;
  period: string;
  bullets: string[];
}

export interface SectionBlock extends BaseBlock {
  type: "section";
  title: string; // e.g. "Education", "Projects", "Skills"
  collapsed?: boolean;
}

export type ResumeBlock =
  | HeadingBlock
  | ParagraphBlock
  | BulletListBlock
  | SkillMeterBlock
  | TimelineBlock
  | ProjectCardBlock
  | InternshipCardBlock
  | SectionBlock;

export interface ResumePage {
  id: string;
  width: number;
  height: number;
  margin: number;
  blocks: ResumeBlock[];
  backgroundColor?: string;
}

export interface ResumeDocument {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  pages: ResumePage[];
  colorPalette?: string[];
  fontFamily?: string;
}

export type TemplateCategory = "student" | "internship" | "fresher" | "professional";

export interface TemplateMeta {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  thumbnail?: string;
  document: ResumeDocument;
}
