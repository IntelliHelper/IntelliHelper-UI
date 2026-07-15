"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import {
  filterAcceptedFiles,
  formatFileSize,
  type FileAcceptRule,
} from "./file-upload-utils";

const fileUploadVariants = cva(
  [
    "relative flex w-full flex-col gap-3 rounded-2xl border border-dashed p-4",
    "transition-[border-color,background,box-shadow] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-default)]",
  ],
  {
    variants: {
      variant: {
        chrome: [
          "border-[var(--glass-chrome-border)]",
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_42%,transparent)]",
          "text-[var(--glass-chrome-fg)]",
          "backdrop-blur-[var(--glass-chrome-blur)]",
        ],
        outline: [
          "border-[var(--glass-chrome-border)]",
          "bg-[color-mix(in_oklch,var(--background)_70%,transparent)]",
          "text-foreground",
        ],
        elevated: [
          "border-[color-mix(in_oklch,var(--glass-chrome-border)_85%,transparent)]",
          "bg-[color-mix(in_oklch,var(--glass-surface-fill)_45%,transparent)]",
          "text-foreground",
          "backdrop-blur-[var(--glass-chrome-blur)]",
        ],
      },
      state: {
        idle: "",
        dragging: [
          "border-primary/50",
          "bg-[color-mix(in_oklch,var(--primary)_10%,transparent)]",
          "shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--primary)_25%,transparent)]",
        ],
        error: "border-destructive/50 bg-[color-mix(in_oklch,var(--destructive)_8%,transparent)]",
      },
    },
    defaultVariants: {
      variant: "chrome",
      state: "idle",
    },
  },
);

export interface FileUploadProps
  extends Omit<
      HTMLAttributes<HTMLDivElement>,
      "onChange" | "onDrop" | "defaultValue"
    >,
    VariantProps<typeof fileUploadVariants> {
  accept?: FileAcceptRule;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  value?: File[];
  defaultValue?: File[];
  onValueChange?: (files: File[]) => void;
  onReject?: (files: File[]) => void;
  label?: ReactNode;
  description?: ReactNode;
  browseLabel?: string;
  showFileList?: boolean;
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "accept" | "multiple" | "disabled" | "onChange"
  >;
}

const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      className,
      variant,
      state: stateProp,
      accept,
      multiple = true,
      maxSize,
      maxFiles,
      disabled = false,
      value: valueProp,
      defaultValue = [],
      onValueChange,
      onReject,
      label = "Drop files here",
      description = "or click to browse",
      browseLabel = "Browse files",
      showFileList = true,
      inputProps,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const inputId = useId();
    const [uncontrolled, setUncontrolled] = useState<File[]>(defaultValue);
    const [dragging, setDragging] = useState(false);

    const files = valueProp !== undefined ? valueProp : uncontrolled;

    const commit = useCallback(
      (next: File[]) => {
        const limited =
          maxFiles !== undefined ? next.slice(0, Math.max(0, maxFiles)) : next;
        if (valueProp === undefined) {
          setUncontrolled(limited);
        }
        onValueChange?.(limited);
      },
      [maxFiles, onValueChange, valueProp],
    );

    const ingest = useCallback(
      (incoming: Iterable<File>) => {
        if (disabled) {
          return;
        }
        const { accepted, rejected } = filterAcceptedFiles(incoming, {
          accept,
          maxSize,
        });
        if (rejected.length) {
          onReject?.(rejected);
        }
        if (!accepted.length) {
          return;
        }
        if (multiple) {
          const merged = [...files];
          for (const file of accepted) {
            const exists = merged.some(
              (item) =>
                item.name === file.name &&
                item.size === file.size &&
                item.lastModified === file.lastModified,
            );
            if (!exists) {
              merged.push(file);
            }
          }
          commit(merged);
        } else {
          commit([accepted[0]!]);
        }
      },
      [accept, commit, disabled, files, maxSize, multiple, onReject],
    );

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      const list = event.target.files;
      if (list) {
        ingest(list);
      }
      event.target.value = "";
    };

    const onDrop = (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setDragging(false);
      if (disabled) {
        return;
      }
      ingest(event.dataTransfer.files);
    };

    const removeAt = (index: number) => {
      commit(files.filter((_, i) => i !== index));
    };

    const visualState =
      stateProp ?? (dragging ? "dragging" : undefined) ?? "idle";

    const acceptAttr = Array.isArray(accept)
      ? accept.join(",")
      : (accept ?? undefined);

    return (
      <div
        ref={ref}
        data-slot="file-upload"
        data-dragging={dragging || undefined}
        data-disabled={disabled || undefined}
        className={cn(
          fileUploadVariants({ variant, state: visualState, className }),
          disabled && "pointer-events-none opacity-50",
        )}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) {
            setDragging(true);
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) {
            setDragging(true);
          }
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (event.currentTarget.contains(event.relatedTarget as Node)) {
            return;
          }
          setDragging(false);
        }}
        onDrop={onDrop}
        {...props}
      >
        <input
          {...inputProps}
          ref={inputRef}
          id={inputId}
          type="file"
          className="sr-only"
          accept={acceptAttr}
          multiple={multiple}
          disabled={disabled}
          onChange={onInputChange}
        />

        <div
          data-slot="file-upload-dropzone"
          className="flex flex-col items-center justify-center gap-2 py-6 text-center"
        >
          <UploadIcon className="size-8 opacity-70" />
          <div className="space-y-1">
            <p className="text-sm font-semibold">{label}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <button
            type="button"
            data-slot="file-upload-browse"
            className={cn(
              "mt-1 inline-flex h-9 items-center justify-center rounded-full px-4 text-xs font-semibold",
              "glass-chrome glass-chrome-interactive glass-chrome-text",
              focusRing,
            )}
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
          >
            {browseLabel}
          </button>
        </div>

        {showFileList && files.length > 0 ? (
          <ul
            data-slot="file-upload-list"
            className="flex flex-col gap-2 border-t border-[color-mix(in_oklch,var(--glass-chrome-border)_70%,transparent)] pt-3"
          >
            {files.map((file, index) => (
              <li
                key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                data-slot="file-upload-item"
                className="flex items-center gap-3 rounded-xl border border-[color-mix(in_oklch,var(--glass-chrome-border)_60%,transparent)] bg-[color-mix(in_oklch,var(--background)_40%,transparent)] px-3 py-2"
              >
                <FileIcon className="size-4 shrink-0 opacity-70" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  data-slot="file-upload-remove"
                  aria-label={`Remove ${file.name}`}
                  className={cn(
                    "inline-flex size-7 items-center justify-center rounded-full text-xs",
                    "glass-chrome glass-chrome-interactive",
                    focusRing,
                  )}
                  onClick={() => removeAt(index)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  },
);
FileUpload.displayName = "FileUpload";

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 3v12" />
      <path d="m17 8-5-5-5 5" />
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    </svg>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

export {
  FileUpload,
  fileUploadVariants,
  filterAcceptedFiles,
  formatFileSize,
};
