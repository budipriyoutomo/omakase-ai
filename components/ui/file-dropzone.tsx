"use client";

import type { Accept } from "react-dropzone";
import { useCallback, useId, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const defaultImageAccept: Accept = {
  "image/jpeg": [".jpeg", ".jpg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"]
};

export type FileDropzoneProps = {
  label?: string;
  hint?: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
  accept?: Accept;
  maxFiles?: number;
  maxSizeBytes?: number;
  disabled?: boolean;
  className?: string;
  emptyLabel?: string;
  idleHint?: string;
};

function formatMb(bytes: number): string {
  return `${Math.round(bytes / (1024 * 1024))}MB`;
}

export function FileDropzone({
  label,
  hint,
  files,
  onFilesChange,
  accept = defaultImageAccept,
  maxFiles = 6,
  maxSizeBytes = 15 * 1024 * 1024,
  disabled = false,
  className,
  emptyLabel = "Drag & drop or click",
  idleHint = "PNG, JPG, WebP · max " + formatMb(maxSizeBytes) + ` · up to ${maxFiles}`
}: FileDropzoneProps) {
  const inputId = useId();

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (!accepted.length) return;
      if (maxFiles <= 1) {
        onFilesChange(accepted.slice(0, 1));
      } else {
        onFilesChange([...files, ...accepted].slice(0, maxFiles));
      }
    },
    [files, maxFiles, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections, isFocused } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize: maxSizeBytes,
    multiple: maxFiles !== 1,
    disabled
  });

  const rejectionSummaries = useMemo(
    () =>
      fileRejections.map(({ file, errors }) => ({
        file: file.name,
        errors: errors.map((e) => e.message).join(", ")
      })),
    [fileRejections]
  );

  const rootProps = getRootProps();

  function removeAt(index: number) {
    onFilesChange(files.filter((_, i) => i !== index));
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium leading-none text-foreground">
          {label}
        </label>
      ) : null}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}

      <div
        {...rootProps}
        className={cn(
          "flex min-h-[7.5rem] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-8 text-center transition-colors",
          disabled && "pointer-events-none cursor-not-allowed opacity-50",
          isDragActive && "border-primary/70 bg-primary/5",
          isFocused && !isDragActive && "ring-2 ring-ring ring-offset-2 ring-offset-background"
        )}
      >
        <input {...getInputProps({ id: inputId })} />
        <Upload className="size-10 text-muted-foreground" aria-hidden />
        <div className="space-y-1">
          <p className={cn("text-sm font-medium", isDragActive ? "text-gold" : "text-foreground")}>
            {isDragActive ? "Drop files here…" : emptyLabel}
          </p>
          <p className="text-xs text-muted-foreground">{idleHint}</p>
        </div>
      </div>

      {files.length > 0 ? (
        <ul className="flex flex-wrap gap-2 pt-1" aria-label="Selected files">
          {files.map((file, idx) => (
            <li
              key={`${file.name}-${file.lastModified}-${idx}`}
              className="flex max-w-full items-center gap-1 rounded-lg border border-border bg-background px-2 py-1 pr-1 text-xs"
            >
              <span className="truncate">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                onClick={(event) => {
                  event.stopPropagation();
                  removeAt(idx);
                }}
                aria-label={`Remove ${file.name}`}
              >
                <X className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}

      {rejectionSummaries.length > 0 ? (
        <ul className="text-xs text-destructive" aria-live="polite">
          {rejectionSummaries.map((rej, rejIdx) => (
            <li key={`${rej.file}-${rejIdx}`}>
              {rej.file}: {rej.errors}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
