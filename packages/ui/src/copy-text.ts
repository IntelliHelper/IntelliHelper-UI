/**
 * Copy plain text to the clipboard.
 * Uses Clipboard API when available; falls back to execCommand for older envs.
 * Returns true when the copy is believed to have succeeded.
 */
export async function copyText(text: string): Promise<boolean> {
  if (typeof text !== "string") {
    return false;
  }

  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through to legacy path
    }
  }

  if (typeof document === "undefined") {
    return false;
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
