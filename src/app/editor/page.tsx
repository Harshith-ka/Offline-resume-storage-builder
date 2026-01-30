"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, ZoomIn, ZoomOut, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlockPalette } from "@/components/editor/BlockPalette";
import { BlockRenderer } from "@/components/editor/BlockRenderer";
import { useEditorStore } from "@/store/editor-store";
import { saveResume } from "@/lib/db";

const GRID_SIZE = 8;
const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

export default function EditorPage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; blockId: string } | null>(null);

  const {
    document,
    currentPageIndex,
    selectedBlockId,
    zoom,
    setDocument,
    loadTemplate,
    selectBlock,
    setZoom,
    getCurrentPage,
    updateBlock,
    removeBlock,
    moveBlock,
  } = useEditorStore();

  useEffect(() => {
    if (templateId) loadTemplate(templateId);
  }, [templateId, loadTemplate]);

  const page = getCurrentPage();
  const blocks = page?.blocks ?? [];

  const handleCanvasClick = useCallback(() => {
    selectBlock(null);
  }, [selectBlock]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, blockId: string) => {
      if ((e.target as HTMLElement).closest("input, textarea")) return;
      e.preventDefault();
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY, blockId };
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !dragStart.current) return;
      const dx = (e.clientX - dragStart.current.x) / zoom;
      const dy = (e.clientY - dragStart.current.y) / zoom;
      moveBlock(dragStart.current.blockId, dx, dy);
      dragStart.current = { x: e.clientX, y: e.clientY, blockId: dragStart.current.blockId };
    },
    [isDragging, zoom, moveBlock]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
  }, []);

  const handleSave = useCallback(async () => {
    const doc = useEditorStore.getState().document;
    await saveResume(doc);
    setDocument({ ...doc, updatedAt: new Date().toISOString() });
  }, [setDocument]);

  const selectedBlock = useEditorStore.getState().getSelectedBlock();

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Toolbar */}
      <header className="glass flex shrink-0 items-center justify-between border-b border-white/5 px-4 py-2">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-5" />
          </Link>
          <span className="font-medium">{document.name}</span>
          <Button variant="ghost" size="sm" onClick={handleSave}>
            <Save className="size-4" />
            Save
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom(Math.min(1.2, zoom + 0.1))}
            aria-label="Zoom in"
          >
            <ZoomIn className="size-4" />
          </Button>
          <span className="min-w-[3rem] text-center text-sm text-muted-foreground">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom(Math.max(0.4, zoom - 0.1))}
            aria-label="Zoom out"
          >
            <ZoomOut className="size-4" />
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/editor/export">Export</Link>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="flex w-56 shrink-0 flex-col gap-4 overflow-y-auto border-r border-border bg-card/50 p-4">
          <BlockPalette />
          {selectedBlock && (
            <div className="rounded-xl border border-border bg-card p-3">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Selected
              </h3>
              <p className="text-sm">{selectedBlock.type}</p>
              <Button
                variant="destructive"
                size="sm"
                className="mt-2 w-full"
                onClick={() => removeBlock(selectedBlock.id)}
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            </div>
          )}
        </aside>

        {/* Canvas */}
        <div
          className="flex flex-1 items-center justify-center overflow-auto bg-muted/20 p-8"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <div
            ref={canvasRef}
            className="relative shrink-0 rounded-lg shadow-2xl"
            style={{
              width: PAGE_WIDTH * zoom,
              height: PAGE_HEIGHT * zoom,
              backgroundImage: `
                linear-gradient(to right, rgba(0,0,0,.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,0,0,.03) 1px, transparent 1px)
              `,
              backgroundSize: `${GRID_SIZE * zoom}px ${GRID_SIZE * zoom}px`,
            }}
          >
            <div
              className="absolute inset-0 rounded-lg bg-white"
              style={{
                left: (page?.margin ?? 48) * zoom,
                top: (page?.margin ?? 48) * zoom,
                width: (PAGE_WIDTH - 2 * (page?.margin ?? 48)) * zoom,
                height: (PAGE_HEIGHT - 2 * (page?.margin ?? 48)) * zoom,
              }}
              onClick={handleCanvasClick}
            >
              {blocks
                .slice()
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((block) => (
                  <div
                    key={block.id}
                    className="absolute"
                    style={{ left: 0, top: 0 }}
                    onPointerDown={(e) => handlePointerDown(e, block.id)}
                  >
                    <BlockRenderer
                      block={block}
                      selected={selectedBlockId === block.id}
                      scale={zoom}
                      onSelect={selectBlock}
                      onUpdate={updateBlock}
                      readOnly={false}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
