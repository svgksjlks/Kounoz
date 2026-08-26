'use client';

import React, { useRef, useState } from 'react';
import { Upload, Loader2, CheckCircle2, AlertCircle, X, ImagePlus } from 'lucide-react';

interface CloudinaryUploadProps {
  /** Called when an image is successfully uploaded with the Cloudinary URL */
  onUpload: (url: string) => void;
  /** Current image URL to display as preview */
  currentUrl?: string;
  /** Label shown above the uploader */
  label?: string;
  /** Allow clearing / removing the current image */
  allowClear?: boolean;
}

export function CloudinaryUpload({ onUpload, currentUrl, label, allowClear = false }: CloudinaryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('يسمح فقط بملفات الصور');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.url) {
        onUpload(data.url);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.error || 'حدث خطأ أثناء الرفع');
      }
    } catch (err) {
      setError('تعذر الاتصال بالخادم');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-bold text-noir">{label}</label>}

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl transition-all cursor-pointer group ${
          uploading
            ? 'border-accent/50 bg-accent/5'
            : success
            ? 'border-emerald-400 bg-emerald-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-border-subtle hover:border-accent/60 hover:bg-accent/5'
        }`}
      >
        {/* Current image preview */}
        {currentUrl && (
          <div className="relative w-full aspect-square rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={currentUrl} alt="preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-noir/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <span className="text-white text-xs font-bold">تغيير الصورة</span>
            </div>
            {allowClear && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onUpload(''); }}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>
        )}

        {/* Empty state */}
        {!currentUrl && (
          <div className="py-6 flex flex-col items-center gap-2 text-center px-4">
            {uploading ? (
              <>
                <Loader2 size={24} className="text-accent animate-spin" />
                <p className="text-xs text-muted">جاري الرفع على Cloudinary...</p>
              </>
            ) : success ? (
              <>
                <CheckCircle2 size={24} className="text-emerald-500" />
                <p className="text-xs text-emerald-600 font-bold">تم الرفع بنجاح ☁️</p>
              </>
            ) : (
              <>
                <ImagePlus size={24} className="text-muted group-hover:text-accent transition-colors" />
                <div>
                  <p className="text-xs font-bold text-noir">اسحب صورة هنا أو انقر للاختيار</p>
                  <p className="text-[10px] text-muted mt-0.5">JPG, PNG, WEBP — حتى 10MB</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Upload overlay when has image but uploading */}
        {currentUrl && uploading && (
          <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
            <Loader2 size={24} className="text-accent animate-spin" />
          </div>
        )}
      </div>

      {/* Status */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}
      {success && currentUrl && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600">
          <CheckCircle2 size={12} />
          <span>تم الرفع على Cloudinary بنجاح</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
      />
    </div>
  );
}

// ── Multi-image uploader ───────────────────────────────────────────────────
interface MultiCloudinaryUploadProps {
  onUpload: (urls: string[]) => void;
  currentUrls?: string[];
  maxFiles?: number;
  label?: string;
}

export function MultiCloudinaryUpload({ onUpload, currentUrls = [], maxFiles = 4, label }: MultiCloudinaryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList) => {
    const remaining = maxFiles - currentUrls.filter(Boolean).length;
    if (remaining <= 0) {
      setError(`الحد الأقصى ${maxFiles} صور`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      const toUpload = Array.from(files).slice(0, remaining);
      toUpload.forEach((f) => formData.append('images', f));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/upload/multiple`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.urls) {
        const merged = [...currentUrls, ...data.urls].slice(0, maxFiles);
        onUpload(merged);
      } else {
        setError(data.error || 'خطأ في الرفع');
      }
    } catch {
      setError('تعذر الاتصال بالخادم');
    } finally {
      setUploading(false);
    }
  };

  const removeUrl = (idx: number) => {
    const updated = currentUrls.filter((_, i) => i !== idx);
    onUpload(updated);
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-bold text-noir">{label}</label>}

      <div className="grid grid-cols-4 gap-2">
        {/* Current images */}
        {currentUrls.filter(Boolean).map((url, idx) => (
          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-border-subtle group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`img-${idx}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeUrl(idx)}
              className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
            >
              <X size={10} />
            </button>
          </div>
        ))}

        {/* Add more */}
        {currentUrls.filter(Boolean).length < maxFiles && (
          <button
            type="button"
            onClick={() => !uploading && inputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-border-subtle hover:border-accent/60 flex flex-col items-center justify-center gap-1 text-muted hover:text-accent transition-all"
          >
            {uploading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Upload size={16} />
                <span className="text-[9px]">إضافة</span>
              </>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ''; }}
      />
    </div>
  );
}
