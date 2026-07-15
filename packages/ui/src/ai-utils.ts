/**
 * Pure helpers for AI kit surfaces (token estimate, stream text, suggestions).
 */

/** Rough token estimate (~4 chars/token) for UI counters — not a real tokenizer. */
export function estimateTokens(text: string): number {
  if (!text) {
    return 0;
  }
  const normalized = text.trim();
  if (!normalized) {
    return 0;
  }
  // Prefer whitespace-separated word count with a char fallback for dense text.
  const words = normalized.split(/\s+/).filter(Boolean).length;
  const byChars = Math.ceil(normalized.length / 4);
  return Math.max(words, 1, Math.min(byChars, words * 3 || byChars));
}

/** Format a token count for badges (e.g. 1.2k). */
export function formatTokenCount(count: number): string {
  if (!Number.isFinite(count) || count < 0) {
    return "0";
  }
  if (count < 1000) {
    return String(Math.round(count));
  }
  if (count < 1_000_000) {
    const k = count / 1000;
    return `${k >= 10 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, "")}k`;
  }
  const m = count / 1_000_000;
  return `${m >= 10 ? Math.round(m) : m.toFixed(1).replace(/\.0$/, "")}m`;
}

/** Append a stream chunk to accumulated text (handles empty chunks). */
export function appendStreamChunk(
  previous: string,
  chunk: string | undefined | null,
): string {
  if (chunk == null || chunk === "") {
    return previous;
  }
  return previous + chunk;
}

/** Join an ordered list of stream deltas into final text. */
export function joinStreamChunks(chunks: readonly string[]): string {
  return chunks.join("");
}

/** Filter prompt suggestions by a free-text query (label + keywords). */
export type PromptSuggestion = {
  id: string;
  label: string;
  prompt: string;
  keywords?: readonly string[];
};

export function filterPromptSuggestions(
  suggestions: readonly PromptSuggestion[],
  query: string,
): PromptSuggestion[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [...suggestions];
  }
  return suggestions.filter((item) => {
    if (item.label.toLowerCase().includes(normalized)) {
      return true;
    }
    if (item.prompt.toLowerCase().includes(normalized)) {
      return true;
    }
    return (item.keywords ?? []).some((keyword) =>
      keyword.toLowerCase().includes(normalized),
    );
  });
}

export type ConversationItem = {
  id: string;
  title: string;
  updatedAt: number;
  pinned?: boolean;
};

/** Sort conversations: pinned first, then newest `updatedAt`. */
export function sortConversations(
  items: readonly ConversationItem[],
): ConversationItem[] {
  return [...items].sort((a, b) => {
    if (Boolean(a.pinned) !== Boolean(b.pinned)) {
      return a.pinned ? -1 : 1;
    }
    return b.updatedAt - a.updatedAt;
  });
}
