'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  Move,
  Crop,
} from 'lucide-react';

interface ImageAdjusterModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  cropShape?: 'round' | 'rect';
  aspectRatio?: number; // width / height, default 1
  onClose: () => void;
  onApply: (adjustedDataUrl: string) => void;
}

export default function ImageAdjusterModal({
  isOpen,
  imageSrc,
  cropShape = 'round',
  aspectRatio = 1,
  onClose,
  onApply,
}: ImageAdjusterModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Reset state on open or new image
  useEffect(() => {
    if (isOpen && imageSrc) {
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });

      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imageRef.current = img;
        drawPreview();
      };
      img.src = imageSrc;
    }
  }, [isOpen, imageSrc]);

  // Redraw preview whenever zoom, rotation, offset changes
  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.save();

    // Center canvas
    ctx.translate(width / 2 + offset.x, height / 2 + offset.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Calculate aspect fit size
    const imgAspect = img.width / img.height;
    let drawW = width;
    let drawH = height;

    if (imgAspect > width / height) {
      drawW = height * imgAspect;
    } else {
      drawH = width / imgAspect;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  }, [zoom, rotation, offset]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  // Mouse / Touch Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    // Output high-resolution canvas
    const outputSize = 600;
    const outCanvas = document.createElement('canvas');
    outCanvas.width = outputSize;
    outCanvas.height = outputSize / aspectRatio;
    const outCtx = outCanvas.getContext('2d');

    if (!outCtx) return;

    outCtx.save();

    // If circular, clip
    if (cropShape === 'round') {
      outCtx.beginPath();
      outCtx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
      outCtx.closePath();
      outCtx.clip();
    }

    // Transform with zoom, rotation and proportional offset
    const scaleFactor = outputSize / canvas.width;
    outCtx.translate(
      outputSize / 2 + offset.x * scaleFactor,
      outCanvas.height / 2 + offset.y * scaleFactor
    );
    outCtx.rotate((rotation * Math.PI) / 180);
    outCtx.scale(zoom * scaleFactor, zoom * scaleFactor);

    const imgAspect = img.width / img.height;
    let drawW = canvas.width;
    let drawH = canvas.height;

    if (imgAspect > canvas.width / canvas.height) {
      drawW = canvas.height * imgAspect;
    } else {
      drawH = canvas.width / imgAspect;
    }

    outCtx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    outCtx.restore();

    const dataUrl = outCanvas.toDataURL('image/jpeg', 0.92);
    onApply(dataUrl);
    onClose();
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-[#eae1da] shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#f5ece5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#173124] text-white flex items-center justify-center">
              <Crop className="w-4 h-4 text-[#98b5a3]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#173124]">
                Ajuster et Cadrer la Photo
              </h3>
              <p className="text-[11px] text-[#727973]">
                Glissez pour déplacer, zoomez et pivotez l&apos;image
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#727973] hover:bg-[#f5ece5] transition-all"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Cropper Viewport */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="relative w-full aspect-square max-w-[320px] mx-auto bg-[#1c1917] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none shadow-inner border-2 border-[#eae1da] touch-none"
        >
          <canvas
            ref={canvasRef}
            width={320}
            height={320}
            className="w-full h-full object-contain"
          />

          {/* Mask Overlay: Circular or Rounded Rect */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {cropShape === 'round' ? (
              <div className="w-full h-full rounded-full border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]" />
            ) : (
              <div className="w-full h-full rounded-xl border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]" />
            )}
          </div>

          {/* Center Guide Crosshair Hint */}
          <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur-xs text-[10px] text-white font-medium flex items-center gap-1 pointer-events-none">
            <Move className="w-3 h-3" />
            <span>Glisser pour ajuster</span>
          </div>
        </div>

        {/* Control Tools (Zoom, Rotate, Reset) */}
        <div className="space-y-3 pt-1">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3 bg-[#fff8f4] p-3 rounded-2xl border border-[#eae1da]">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
              className="p-1.5 rounded-lg bg-white border border-[#eae1da] text-[#7a5739] hover:bg-[#f5ece5]"
              title="Dézoomer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <input
              type="range"
              min="0.6"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-[#173124] cursor-pointer"
            />

            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3, z + 0.15))}
              className="p-1.5 rounded-lg bg-white border border-[#eae1da] text-[#7a5739] hover:bg-[#f5ece5]"
              title="Zoomer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono font-bold text-[#173124] min-w-[40px] text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleRotate}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#f5ece5] hover:bg-[#eae1da] text-[#1f1b17] text-xs font-semibold transition-all"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#7a5739]" />
              <span>Pivoter 90°</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#eae1da] hover:bg-[#f5ece5] text-[#727973] text-xs font-semibold transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Réinitialiser</span>
            </button>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f5ece5]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#eae1da] text-xs font-semibold text-[#424844] hover:bg-[#f5ece5] transition-all"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#173124] text-white text-xs font-bold hover:bg-[#2d4739] shadow-md transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Valider le cadrage</span>
          </button>
        </div>
      </div>
    </div>
  );
}
