import { useState, useRef, useCallback, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Move, Check } from 'lucide-react';

interface ImageCropModalProps {
  file: File;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
  aspectRatio?: number; // width/height, default 16/9
  maxWidth?: number;
}

const TARGET_ASPECT = 16 / 9;
const MAX_OUTPUT_WIDTH = 1200;

export default function ImageCropModal({
  file,
  onConfirm,
  onCancel,
  aspectRatio = TARGET_ASPECT,
  maxWidth = MAX_OUTPUT_WIDTH,
}: ImageCropModalProps) {
  const [imgSrc, setImgSrc] = useState('');
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Load image
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImgSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleImageLoad = () => {
    if (!imgRef.current || !containerRef.current) return;
    const img = imgRef.current;
    const container = containerRef.current;
    const cW = container.clientWidth;
    const cH = cW / aspectRatio;

    const nW = img.naturalWidth;
    const nH = img.naturalHeight;
    setNaturalSize({ w: nW, h: nH });

    // Calculate minimum scale to cover the crop area
    const scaleW = cW / nW;
    const scaleH = cH / nH;
    const minScale = Math.max(scaleW, scaleH);
    setScale(minScale);
    // Center
    setOffset({
      x: (cW - nW * minScale) / 2,
      y: (cH - nH * minScale) / 2,
    });
  };

  const getMinScale = useCallback(() => {
    if (!containerRef.current || !naturalSize.w) return 0.1;
    const cW = containerRef.current.clientWidth;
    const cH = cW / aspectRatio;
    return Math.max(cW / naturalSize.w, cH / naturalSize.h);
  }, [naturalSize, aspectRatio]);

  const clampOffset = useCallback((ox: number, oy: number, s: number) => {
    if (!containerRef.current || !naturalSize.w) return { x: ox, y: oy };
    const cW = containerRef.current.clientWidth;
    const cH = cW / aspectRatio;
    const imgW = naturalSize.w * s;
    const imgH = naturalSize.h * s;
    return {
      x: Math.min(0, Math.max(cW - imgW, ox)),
      y: Math.min(0, Math.max(cH - imgH, oy)),
    };
  }, [naturalSize, aspectRatio]);

  const handleZoom = (delta: number) => {
    const minS = getMinScale();
    const newScale = Math.max(minS, Math.min(scale * 3, scale + delta));
    const newOffset = clampOffset(offset.x, offset.y, newScale);
    setScale(newScale);
    setOffset(newOffset);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const newOffset = clampOffset(e.clientX - dragStart.x, e.clientY - dragStart.y, scale);
    setOffset(newOffset);
  };

  const handleMouseUp = () => setDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setDragging(true);
    setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return;
    const touch = e.touches[0];
    const newOffset = clampOffset(touch.clientX - dragStart.x, touch.clientY - dragStart.y, scale);
    setOffset(newOffset);
  };

  const handleConfirm = () => {
    if (!containerRef.current || !naturalSize.w) return;
    const cW = containerRef.current.clientWidth;
    const cH = cW / aspectRatio;

    // Calculate crop region in natural image coords
    const cropX = -offset.x / scale;
    const cropY = -offset.y / scale;
    const cropW = cW / scale;
    const cropH = cH / scale;

    // Output dimensions
    const outW = Math.min(maxWidth, Math.round(cropW));
    const outH = Math.round(outW / aspectRatio);

    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(imgRef.current!, cropX, cropY, cropW, cropH, 0, 0, outW, outH);

    canvas.toBlob(
      (blob) => {
        if (blob) onConfirm(blob);
      },
      'image/webp',
      0.85
    );
  };

  const cropHeight = containerRef.current
    ? containerRef.current.clientWidth / aspectRatio
    : 300;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-card border border-border rounded-xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h3 className="font-heading text-lg text-foreground">Ajustar imagem de capa</h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Crop area */}
        <div className="px-5 py-4">
          <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
            <Move className="w-3 h-3" /> Arraste para posicionar • Use o zoom para ajustar
          </p>
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-lg bg-black cursor-grab active:cursor-grabbing"
            style={{ height: cropHeight || 300 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => setDragging(false)}
          >
            {imgSrc && (
              <img
                ref={imgRef}
                src={imgSrc}
                alt="Crop preview"
                onLoad={handleImageLoad}
                className="absolute select-none pointer-events-none"
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                  transformOrigin: '0 0',
                  maxWidth: 'none',
                }}
                draggable={false}
              />
            )}
            {/* Grid overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="border border-white/10" />
                ))}
              </div>
            </div>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              type="button"
              onClick={() => handleZoom(-0.05)}
              className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-muted-foreground w-16 text-center">
              {Math.round((scale / getMinScale()) * 100)}%
            </span>
            <button
              type="button"
              onClick={() => handleZoom(0.05)}
              className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-3 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-border text-foreground px-4 py-2.5 rounded-lg font-semibold hover:border-primary hover:text-primary transition-all text-sm"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all text-sm"
          >
            <Check className="w-4 h-4" /> Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
