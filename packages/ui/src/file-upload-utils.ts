export type FileAcceptRule = string | string[] | undefined;

/**
 * Normalize accept string / list into lowercase tokens
 * (e.g. ".png", "image/*", "application/pdf").
 */
export function normalizeAccept(accept: FileAcceptRule): string[] {
  if (!accept) {
    return [];
  }
  const raw = Array.isArray(accept) ? accept : accept.split(",");
  return raw.map((token) => token.trim().toLowerCase()).filter(Boolean);
}

/**
 * Whether a File matches the accept list (empty accept = all files).
 */
export function fileMatchesAccept(file: File, accept: FileAcceptRule): boolean {
  const rules = normalizeAccept(accept);
  if (rules.length === 0) {
    return true;
  }

  const name = file.name.toLowerCase();
  const type = (file.type || "").toLowerCase();

  return rules.some((rule) => {
    if (rule.startsWith(".")) {
      return name.endsWith(rule);
    }
    if (rule.endsWith("/*")) {
      const prefix = rule.slice(0, -1); // "image/"
      return type.startsWith(prefix);
    }
    return type === rule || name.endsWith(`.${rule}`);
  });
}

/**
 * Filter a FileList / File array by accept + optional max size (bytes).
 */
export function filterAcceptedFiles(
  files: Iterable<File>,
  options: { accept?: FileAcceptRule; maxSize?: number } = {},
): { accepted: File[]; rejected: File[] } {
  const accepted: File[] = [];
  const rejected: File[] = [];

  for (const file of files) {
    const okType = fileMatchesAccept(file, options.accept);
    const okSize =
      options.maxSize === undefined || file.size <= options.maxSize;
    if (okType && okSize) {
      accepted.push(file);
    } else {
      rejected.push(file);
    }
  }

  return { accepted, rejected };
}

/**
 * Human-readable file size (B / KB / MB / GB).
 */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "0 B";
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}
