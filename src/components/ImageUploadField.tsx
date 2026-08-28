import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon, X, Check, RefreshCw, Link as LinkIcon, Sparkles } from "lucide-react";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (imageUrl: string) => void;
  placeholder?: string;
  recommendedSize?: string;
  aspectRatio?: "square" | "portrait" | "landscape" | "circle";
  className?: string;
  id?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = "https://ejemplo.com/imagen.jpg",
  recommendedSize = "800x800px (JPG, PNG, WebP)",
  aspectRatio = "square",
  className = "",
  id,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [inputMode, setInputMode] = useState<"upload" | "url">("upload");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith("image/")) {
      setErrorMsg("El archivo seleccionado debe ser una imagen válida (JPG, PNG, WebP, GIF).");
      return;
    }

    // Max 5MB raw
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("La imagen es demasiado pesada (máx 5MB). Por favor selecciona una imagen más liviana.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        // Optimize/compress on canvas if larger than 1200px to ensure smooth local storage performance
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
              onChange(compressedDataUrl);
              return;
            }
          }

          onChange(result);
        };
        img.src = result;
      }
    };
    reader.onerror = () => {
      setErrorMsg("Error al leer el archivo de imagen.");
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const isBase64 = value?.startsWith("data:image");

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and mode switch */}
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A6B]">
          {label}
        </label>
        <div className="flex items-center gap-1 text-[10px]">
          <button
            type="button"
            onClick={() => setInputMode("upload")}
            className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
              inputMode === "upload"
                ? "bg-[#4A4541] text-white font-bold"
                : "text-[#8C7A6B] hover:text-[#423D33]"
            }`}
          >
            Subir Archivo
          </button>
          <button
            type="button"
            onClick={() => setInputMode("url")}
            className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
              inputMode === "url"
                ? "bg-[#4A4541] text-white font-bold"
                : "text-[#8C7A6B] hover:text-[#423D33]"
            }`}
          >
            Enlace URL
          </button>
        </div>
      </div>

      {/* Upload Zone / URL input */}
      {inputMode === "upload" ? (
        <div className="space-y-2">
          <input
            id={id}
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {value ? (
            <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#E5E0DA] shadow-2xs">
              <div
                className={`relative overflow-hidden bg-[#FAF7F2] border border-[#E5E0DA] shrink-0 ${
                  aspectRatio === "circle"
                    ? "w-14 h-14 rounded-full"
                    : aspectRatio === "portrait"
                    ? "w-14 h-18 rounded-xl"
                    : "w-14 h-14 rounded-xl"
                }`}
              >
                <img
                  src={value}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 text-xs font-semibold text-[#423D33] truncate">
                  <Check className="w-3.5 h-3.5 text-[#608058] shrink-0" />
                  <span className="truncate">
                    {isBase64 ? "Imagen cargada desde tu equipo" : "Imagen vinculada"}
                  </span>
                </div>
                <p className="text-[10px] text-[#8C7A6B] truncate">
                  {isBase64 ? "Guardada en el sistema de la tienda" : value}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-full bg-[#FAF7F2] hover:bg-[#F2EDE7] border border-[#E5E0DA] text-[10px] font-semibold text-[#423D33] transition-colors cursor-pointer"
                  title="Cambiar imagen"
                >
                  Cambiar
                </button>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="p-1 rounded-full hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
                  title="Quitar imagen"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-[#8C7A6B] bg-[#8C7A6B]/10 scale-[1.01]"
                  : "border-[#E5E0DA] hover:border-[#8C7A6B] bg-white hover:bg-[#FAF7F2]"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] text-[#8C7A6B] flex items-center justify-center mx-auto mb-2 border border-[#E5E0DA]">
                <Upload className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold text-[#423D33]">
                Haz clic para elegir una imagen o arrástrala aquí
              </p>
              <p className="text-[10px] text-[#8C7A6B] mt-0.5">
                Desde tu escritorio o fotos • {recommendedSize}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <LinkIcon className="w-3.5 h-3.5 text-[#8C7A6B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id={id}
                type="url"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl border border-[#E5E0DA] bg-white text-[#423D33] focus:outline-none focus:ring-1 focus:ring-[#8C7A6B]"
              />
            </div>
            {value && (
              <div
                className={`overflow-hidden bg-[#FAF7F2] border border-[#E5E0DA] shrink-0 ${
                  aspectRatio === "circle"
                    ? "w-10 h-10 rounded-full"
                    : "w-10 h-10 rounded-xl"
                }`}
              >
                <img
                  src={value}
                  alt="Previa"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>
          <p className="text-[10px] text-[#8C7A6B]">
            Introduce la URL directa de la imagen (ej. Unsplash, CDN o tu servidor).
          </p>
        </div>
      )}

      {errorMsg && (
        <p className="text-[10px] font-medium text-red-600 animate-fade-in">
          {errorMsg}
        </p>
      )}
    </div>
  );
};
