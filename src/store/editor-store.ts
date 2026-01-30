import { create } from "zustand";
import type { ResumeDocument, ResumeBlock, ResumePage } from "@/types/resume";
import { templateDocuments } from "@/data/templates";

const BLANK_DOC: ResumeDocument = {
  id: `resume_${Date.now()}`,
  name: "Untitled Resume",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  version: 1,
  pages: [
    {
      id: "page-1",
      width: 794,
      height: 1123,
      margin: 48,
      blocks: [],
    },
  ],
};

interface EditorState {
  document: ResumeDocument;
  currentPageIndex: number;
  selectedBlockId: string | null;
  zoom: number;
  pan: { x: number; y: number };
  setDocument: (doc: ResumeDocument) => void;
  loadTemplate: (templateId: string) => void;
  setCurrentPage: (index: number) => void;
  selectBlock: (id: string | null) => void;
  setZoom: (z: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  getCurrentPage: () => ResumePage | undefined;
  addBlock: (block: ResumeBlock) => void;
  updateBlock: (id: string, updates: Partial<ResumeBlock>) => void;
  removeBlock: (id: string) => void;
  moveBlock: (id: string, dx: number, dy: number) => void;
  getSelectedBlock: () => ResumeBlock | undefined;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  document: BLANK_DOC,
  currentPageIndex: 0,
  selectedBlockId: null,
  zoom: 0.8,
  pan: { x: 0, y: 0 },

  setDocument: (document) => set({ document }),

  loadTemplate: (templateId) => {
    const doc = templateDocuments[templateId];
    if (!doc) {
      set({ document: BLANK_DOC, selectedBlockId: null });
      return;
    }
    const clone: ResumeDocument = JSON.parse(JSON.stringify(doc));
    clone.id = `resume_${Date.now()}`;
    clone.name = doc.name;
    clone.createdAt = new Date().toISOString();
    clone.updatedAt = new Date().toISOString();
    clone.version = 1;
    set({ document: clone, selectedBlockId: null });
  },

  setCurrentPage: (currentPageIndex) => set({ currentPageIndex }),

  selectBlock: (selectedBlockId) => set({ selectedBlockId }),

  setZoom: (zoom) => set({ zoom }),

  setPan: (pan) => set({ pan }),

  getCurrentPage: () => {
    const { document, currentPageIndex } = get();
    return document.pages[currentPageIndex];
  },

  addBlock: (block) => {
    const { document, currentPageIndex } = get();
    const pages = [...document.pages];
    const page = { ...pages[currentPageIndex], blocks: [...pages[currentPageIndex].blocks, block] };
    pages[currentPageIndex] = page;
    set({
      document: { ...document, pages },
      selectedBlockId: block.id,
    });
  },

  updateBlock: (id, updates) => {
    const { document, currentPageIndex } = get();
    const pages = document.pages.map((p, i) => {
      if (i !== currentPageIndex) return p;
      const blocks = p.blocks.map((b) => (b.id === id ? { ...b, ...updates } : b));
      return { ...p, blocks };
    });
    set({ document: { ...document, pages } });
  },

  removeBlock: (id) => {
    const { document, currentPageIndex } = get();
    const pages = document.pages.map((p, i) => {
      if (i !== currentPageIndex) return p;
      return { ...p, blocks: p.blocks.filter((b) => b.id !== id) };
    });
    set({ document: { ...document, pages }, selectedBlockId: null });
  },

  moveBlock: (id, dx, dy) => {
    const GRID = 8;
    const snap = (v: number) => Math.round(v / GRID) * GRID;
    const { document, currentPageIndex } = get();
    const pages = document.pages.map((p, i) => {
      if (i !== currentPageIndex) return p;
      const blocks = p.blocks.map((b) => {
        if (b.id !== id) return b;
        const nx = snap(b.x + dx);
        const ny = snap(b.y + dy);
        return { ...b, x: nx, y: ny };
      });
      return { ...p, blocks };
    });
    set({ document: { ...document, pages } });
  },

  getSelectedBlock: () => {
    const { document, currentPageIndex, selectedBlockId } = get();
    const page = document.pages[currentPageIndex];
    return page?.blocks.find((b) => b.id === selectedBlockId);
  },
}));
