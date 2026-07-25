export type MediaPlayerKind = "video" | "audio";

/** WebVTT / text track for closed captions or subtitles */
export type MediaPlayerCaptionTrack = {
  /** Unique id used for selection state */
  id?: string;
  src: string;
  label: string;
  srcLang?: string;
  kind?: TextTrackKind;
  default?: boolean;
};

/** Alternate rendition for quality switching */
export type MediaPlayerQuality = {
  /** Unique id used for selection state (defaults to label) */
  id?: string;
  src: string;
  /** Display label, e.g. "1080p", "720p", "Auto" */
  label: string;
  /** Optional pixel height for sorting / metadata */
  height?: number;
  type?: string;
};

export type MediaPlayerCaptionValue = string | "off";

export function formatMediaTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function detectMediaKind(
  src?: string,
  kind?: MediaPlayerKind,
): MediaPlayerKind {
  if (kind) return kind;
  if (!src) return "video";
  const lower = src.split("?")[0]?.toLowerCase() ?? "";
  if (/\.(mp3|wav|ogg|m4a|aac|flac|opus)$/.test(lower)) return "audio";
  return "video";
}

export function captionTrackId(
  track: MediaPlayerCaptionTrack,
  index: number,
) {
  return track.id ?? track.srcLang ?? track.label ?? `caption-${index}`;
}

export function qualityId(quality: MediaPlayerQuality, index: number) {
  return quality.id ?? quality.label ?? `quality-${index}`;
}

export function resolveDefaultCaption(
  tracks: MediaPlayerCaptionTrack[],
  preferred?: MediaPlayerCaptionValue,
): MediaPlayerCaptionValue {
  if (preferred === "off") return "off";
  if (preferred) {
    const idx = tracks.findIndex(
      (t, i) => captionTrackId(t, i) === preferred || t.label === preferred,
    );
    if (idx >= 0) return captionTrackId(tracks[idx]!, idx);
  }
  const def = tracks.findIndex((t) => t.default);
  if (def >= 0) return captionTrackId(tracks[def]!, def);
  return "off";
}

export function resolveDefaultQuality(
  qualities: MediaPlayerQuality[],
  preferred?: string,
): string {
  if (preferred) {
    const idx = qualities.findIndex(
      (q, i) => qualityId(q, i) === preferred || q.label === preferred,
    );
    if (idx >= 0) return qualityId(qualities[idx]!, idx);
  }
  let best = 0;
  let bestH = -1;
  qualities.forEach((q, i) => {
    const h = q.height ?? -1;
    if (h > bestH) {
      bestH = h;
      best = i;
    }
  });
  return qualityId(qualities[best]!, best);
}

export function clampVolume(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

/**
 * Resolve which caption track id a browser TextTrack maps to.
 * Matches label / language first, then falls back to array index.
 */
export function matchCaptionTrackId(
  track: TextTrack,
  captions: MediaPlayerCaptionTrack[],
  index: number,
): string {
  const byLabel = captions.findIndex(
    (c, i) =>
      (c.label && c.label === track.label) ||
      (c.srcLang && c.srcLang === track.language) ||
      captionTrackId(c, i) === track.id ||
      captionTrackId(c, i) === track.label,
  );
  if (byLabel >= 0) return captionTrackId(captions[byLabel]!, byLabel);
  const meta = captions[index];
  return meta ? captionTrackId(meta, index) : `track-${index}`;
}
