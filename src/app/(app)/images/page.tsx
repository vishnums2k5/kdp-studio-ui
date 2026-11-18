"use client";

import { useMemo, useState } from "react";
import { Trash2, Tag, Upload, Search, X } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  EmptyState,
  Input,
  Select,
} from "@/components/ui";
import { useApp } from "@/mocks/store";
import { resolveSrc } from "@/lib/resolve-src";
import type { ImageAsset } from "@/mocks/types";

export default function ImagesPage() {
  const images = useApp((s) => s.images);
  const addImage = useApp((s) => s.addImage);
  const deleteImages = useApp((s) => s.deleteImages);
  const tagImage = useApp((s) => s.tagImage);

  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<ImageAsset | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(0);

  const folders = useMemo(
    () => ["all", ...Array.from(new Set(images.map((i) => i.folder)))],
    [images],
  );
  const filtered = useMemo(() => {
    let list = folder === "all" ? images : images.filter((i) => i.folder === folder);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (i) => i.name.toLowerCase().includes(q) || i.tags.some((t) => t.includes(q)),
      );
    }
    return list;
  }, [images, folder, query]);

  const upload = () => {
    const asset = addImage({
      name: `upload-${new Date().toISOString().slice(0, 10)}-${images.length + 1}`,
      src: resolveSrc(`mock:art:${Math.floor(Math.random() * 900)}`),
      folder: "Uploads",
    });
    setUploading((n) => n + 1);
    setTimeout(() => setUploading((n) => Math.max(0, n - 1)), 900);
    setSelected((prev) => new Set(prev));
    return asset;
  };

  return (
    <>
      <Topbar title="My Images" />
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-5 flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-56 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-3" aria-hidden />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search images and tags…"
              className="pl-9"
              aria-label="Search images"
            />
          </div>
          <Select
            className="w-44"
            ariaLabel="Folder"
            value={folder}
            onValueChange={setFolder}
            options={folders.map((f) => ({ value: f, label: f === "all" ? "All folders" : f }))}
          />
          <Button onClick={upload} loading={uploading > 0}>
            <Upload className="size-4" aria-hidden /> Upload
          </Button>
        </div>

        {selected.size > 0 && (
          <div className="mb-4 flex items-center gap-3 rounded-md border border-primary/30 bg-primary-soft px-4 py-2.5">
            <span className="text-sm font-medium">{selected.size} selected</span>
            <Button
              size="sm"
              variant="danger-ghost"
              onClick={() => {
                deleteImages([...selected]);
                setSelected(new Set());
              }}
            >
              <Trash2 className="size-3.5" aria-hidden /> Delete
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
              Clear
            </Button>
          </div>
        )}

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            upload();
          }}
          className={`rounded-lg transition-colors ${dragOver ? "outline-2 outline-dashed outline-primary bg-primary-soft/40" : ""}`}
        >
          {filtered.length === 0 ? (
            <EmptyState
              title="No images"
              description="Upload artwork or generate images from the Studio."
              action={<Button size="sm" onClick={upload}>Upload image</Button>}
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((img) => (
                <Card key={img.id} className="group relative overflow-hidden">
                  <Checkbox
                    aria-label={`Select ${img.name}`}
                    checked={selected.has(img.id)}
                    onCheckedChange={() =>
                      setSelected((prev) => {
                        const next = new Set(prev);
                        if (next.has(img.id)) next.delete(img.id);
                        else next.add(img.id);
                        return next;
                      })
                    }
                    className="absolute left-2.5 top-2.5 z-10 bg-surface/90"
                  />
                  <button onClick={() => setPreview(img)} className="block w-full" aria-label={`Preview ${img.name}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={resolveSrc(img.src)} alt={img.name} className="aspect-square w-full object-cover" />
                  </button>
                  <div className="p-3">
                    <p className="truncate text-sm font-medium">{img.name}</p>
                    <p className="mt-0.5 text-xs text-ink-3">
                      {img.folder} · {img.w}×{img.h}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {img.tags.map((t) => (
                        <Badge key={t} tone="neutral">{t}</Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        {dragOver && (
          <p className="mt-3 text-center text-sm text-primary">Drop to upload</p>
        )}
      </div>

      {/* preview modal */}
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="w-[min(92vw,640px)]">
          {preview && (
            <div className="p-6">
              <DialogTitle className="truncate pr-8">{preview.name}</DialogTitle>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveSrc(preview.src)}
                alt={preview.name}
                className="mt-4 aspect-square w-full rounded-md border border-line object-cover"
              />
              <div className="mt-3 flex items-center gap-2">
                <Badge tone="neutral">{preview.folder}</Badge>
                <Badge tone="neutral">{preview.w}×{preview.h}</Badge>
                <Badge tone="neutral">stored at 131 DPI</Badge>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Tag className="size-4 text-ink-3" aria-hidden />
                <Input
                  aria-label="Tags (comma separated)"
                  value={preview.tags.join(", ")}
                  onChange={(e) => {
                    const tags = e.target.value.split(",").map((t) => t.trim()).filter(Boolean);
                    tagImage(preview.id, tags);
                    setPreview({ ...preview, tags });
                  }}
                  placeholder="tag, tag"
                />
              </div>
              <div className="mt-5 flex justify-between">
                <Button
                  variant="danger-ghost"
                  onClick={() => {
                    deleteImages([preview.id]);
                    setPreview(null);
                  }}
                >
                  <Trash2 className="size-4" aria-hidden /> Delete
                </Button>
                <DialogClose asChild><Button>Done</Button></DialogClose>
              </div>
              <button
                onClick={() => setPreview(null)}
                className="absolute right-4 top-4 grid size-8 place-items-center rounded-sm text-ink-2 hover:bg-surface-3"
                aria-label="Close preview"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
