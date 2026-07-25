"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MediaHTMLAttributes,
  type ReactNode,
} from "react";
import { cn, focusRing } from "@intelli/utils";

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

const mediaPlayerVariants = cva(
  [
    "group/media relative flex w-full flex-col overflow-hidden",
    "border border-[var(--glass-chrome-border)]",
    "transition-[box-shadow,border-color] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-spring)]",
  ],
  {
    variants: {
      variant: {
        chrome: [
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_48%,transparent)]",
          "backdrop-blur-[var(--glass-chrome-blur)]",
          "shadow-[var(--glass-chrome-inset)]",
        ],
        elevated: [
          "bg-[color-mix(in_oklch,var(--glass-surface-fill)_70%,transparent)]",
          "backdrop-blur-[var(--glass-blur)]",
          "shadow-[var(--glass-chrome-shadow),var(--glass-chrome-inset)]",
        ],
        outline: [
          "bg-[color-mix(in_oklch,var(--background)_60%,transparent)]",
          "shadow-none",
        ],
      },
      kind: {
        video: "rounded-2xl",
        audio: "rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "chrome",
      kind: "video",
    },
  },
);

const mediaPlayerControlsVariants = cva(
  [
    "flex flex-col gap-2 p-3",
    "border-t border-[color-mix(in_oklch,var(--glass-chrome-border)_70%,transparent)]",
    "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_62%,transparent)]",
    "backdrop-blur-[var(--glass-chrome-blur)]",
    "text-[var(--glass-chrome-fg)]",
  ],
  {
    variants: {
      kind: {
        video: [
          "absolute inset-x-0 bottom-0 border-t-0",
          "bg-gradient-to-t from-[color-mix(in_oklch,black_55%,transparent)] via-[color-mix(in_oklch,black_25%,transparent)] to-transparent",
          "backdrop-blur-none",
          "opacity-0 transition-opacity duration-[var(--duration-normal)]",
          "group-hover/media:opacity-100 group-focus-within/media:opacity-100",
          "data-[playing=false]:opacity-100",
          "data-[menu-open=true]:opacity-100",
        ],
        audio: "",
      },
    },
    defaultVariants: {
      kind: "video",
    },
  },
);

const menuPanelClass = cn(
  "absolute bottom-[calc(100%+0.5rem)] right-0 z-20 min-w-[9.5rem] overflow-hidden rounded-xl py-1",
  "border border-[var(--glass-chrome-border)]",
  "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_88%,transparent)]",
  "text-[var(--glass-chrome-fg)]",
  "backdrop-blur-[var(--glass-chrome-blur)]",
  "shadow-[var(--glass-chrome-shadow),var(--glass-chrome-inset)]",
  "animate-fade-in",
);

function formatTime(seconds: number) {
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

function detectKind(src?: string, kind?: MediaPlayerKind): MediaPlayerKind {
  if (kind) return kind;
  if (!src) return "video";
  const lower = src.split("?")[0]?.toLowerCase() ?? "";
  if (/\.(mp3|wav|ogg|m4a|aac|flac|opus)$/.test(lower)) return "audio";
  return "video";
}

function captionTrackId(track: MediaPlayerCaptionTrack, index: number) {
  return track.id ?? track.srcLang ?? track.label ?? `caption-${index}`;
}

function qualityId(quality: MediaPlayerQuality, index: number) {
  return quality.id ?? quality.label ?? `quality-${index}`;
}

function resolveDefaultCaption(
  tracks: MediaPlayerCaptionTrack[],
  preferred?: MediaPlayerCaptionValue,
): MediaPlayerCaptionValue {
  if (preferred === "off") return "off";
  if (preferred) {
    const match = tracks.find(
      (t, i) => captionTrackId(t, i) === preferred || t.label === preferred,
    );
    if (match) return captionTrackId(match, tracks.indexOf(match));
  }
  const def = tracks.findIndex((t) => t.default);
  if (def >= 0) return captionTrackId(tracks[def]!, def);
  return "off";
}

function resolveDefaultQuality(
  qualities: MediaPlayerQuality[],
  preferred?: string,
): string {
  if (preferred) {
    const match = qualities.find(
      (q, i) => qualityId(q, i) === preferred || q.label === preferred,
    );
    if (match) return qualityId(match, qualities.indexOf(match));
  }
  // Prefer highest height when present, else first
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

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function VolumeIcon({ className, muted }: { className?: string; muted?: boolean }) {
  if (muted) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
        <path d="M11 5 6 9H3v6h3l5 4z" />
        <path d="m22 9-6 6" />
        <path d="m16 9 6 6" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M11 5 6 9H3v6h3l5 4z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function FullscreenIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M16 3h3a2 2 0 0 1 2 2v3" />
      <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

function CcIcon({ className, active }: { className?: string; active?: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <rect x="2" y="5" width="20" height="14" rx="2" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.18 : 0} />
      <path d="M7.5 12.5a1.75 1.75 0 0 1 0-3h.25" />
      <path d="M7.5 15.5a1.75 1.75 0 0 0 0-3h.25" />
      <path d="M14.5 12.5a1.75 1.75 0 0 1 0-3h.25" />
      <path d="M14.5 15.5a1.75 1.75 0 0 0 0-3h.25" />
      <path d="M10 10.5v3" opacity={active ? 1 : 0.85} />
      <path d="M17 10.5v3" opacity={active ? 1 : 0.85} />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ControlButton({
  label,
  onClick,
  children,
  className,
  disabled,
  pressed,
  expanded,
  controls,
}: {
  label: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  pressed?: boolean;
  expanded?: boolean;
  controls?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      aria-expanded={expanded}
      aria-controls={controls}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full",
        "text-current",
        "transition-[background,transform,opacity] duration-[var(--duration-fast)]",
        "hover:bg-[color-mix(in_oklch,white_14%,transparent)]",
        "active:scale-95",
        "disabled:pointer-events-none disabled:opacity-40",
        pressed && "bg-[color-mix(in_oklch,white_16%,transparent)]",
        focusRing,
        className,
      )}
    >
      {children}
    </button>
  );
}

function MenuOption({
  selected,
  onSelect,
  children,
}: {
  selected?: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium",
        "transition-colors duration-[var(--duration-fast)]",
        "hover:bg-[color-mix(in_oklch,white_12%,transparent)]",
        selected && "bg-[color-mix(in_oklch,var(--primary)_18%,transparent)]",
        focusRing,
      )}
    >
      <span className="flex size-3.5 shrink-0 items-center justify-center">
        {selected ? <CheckIcon className="size-3.5" /> : null}
      </span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </button>
  );
}

export type MediaPlayerHandle = {
  play: () => Promise<void> | void;
  pause: () => void;
  seek: (time: number) => void;
  getMediaElement: () => HTMLMediaElement | null;
  setCaption: (value: MediaPlayerCaptionValue) => void;
  setQuality: (id: string) => void;
};

export interface MediaPlayerProps
  extends Omit<
      HTMLAttributes<HTMLDivElement>,
      "onTimeUpdate" | "onVolumeChange"
    >,
    VariantProps<typeof mediaPlayerVariants> {
  src?: string;
  kind?: MediaPlayerKind;
  poster?: string;
  title?: string;
  subtitle?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  preload?: MediaHTMLAttributes<HTMLVideoElement>["preload"];
  showFullscreen?: boolean;
  showVolume?: boolean;
  /** Show CC control when caption tracks are provided (default true) */
  showCaptions?: boolean;
  /** Show quality control when qualities are provided (default true) */
  showQuality?: boolean;
  defaultVolume?: number;
  /** WebVTT caption / subtitle tracks (video) */
  captions?: MediaPlayerCaptionTrack[];
  /** Controlled caption track id, or `"off"` */
  caption?: MediaPlayerCaptionValue;
  defaultCaption?: MediaPlayerCaptionValue;
  onCaptionChange?: (value: MediaPlayerCaptionValue) => void;
  /** Multi-bitrate / multi-resolution sources */
  qualities?: MediaPlayerQuality[];
  /** Controlled quality id (or label) */
  quality?: string;
  defaultQuality?: string;
  onQualityChange?: (id: string, quality: MediaPlayerQuality) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (time: number, duration: number) => void;
  onVolumeChange?: (volume: number, muted: boolean) => void;
  mediaProps?: Omit<
    MediaHTMLAttributes<HTMLVideoElement & HTMLAudioElement>,
    "src" | "controls" | "autoPlay" | "loop" | "muted" | "poster" | "preload" | "playsInline" | "children"
  >;
}

const MediaPlayer = forwardRef<MediaPlayerHandle, MediaPlayerProps>(
  (
    {
      className,
      variant,
      kind: kindProp,
      src: srcProp,
      poster,
      title,
      subtitle,
      autoPlay = false,
      loop = false,
      muted: mutedProp,
      playsInline = true,
      preload = "metadata",
      showFullscreen = true,
      showVolume = true,
      showCaptions = true,
      showQuality = true,
      defaultVolume = 0.85,
      captions = [],
      caption: captionProp,
      defaultCaption,
      onCaptionChange,
      qualities = [],
      quality: qualityProp,
      defaultQuality,
      onQualityChange,
      onPlay,
      onPause,
      onEnded,
      onTimeUpdate,
      onVolumeChange,
      mediaProps,
      ...props
    },
    ref,
  ) => {
    const hasQualities = qualities.length > 0;
    const hasCaptions = captions.length > 0;

    const [uncontrolledQuality, setUncontrolledQuality] = useState(() =>
      hasQualities ? resolveDefaultQuality(qualities, defaultQuality) : "",
    );
    const qualityValue = qualityProp ?? uncontrolledQuality;

    const activeQuality = useMemo(() => {
      if (!hasQualities) return null;
      const idx = qualities.findIndex(
        (q, i) => qualityId(q, i) === qualityValue || q.label === qualityValue,
      );
      const i = idx >= 0 ? idx : 0;
      return { quality: qualities[i]!, id: qualityId(qualities[i]!, i), index: i };
    }, [hasQualities, qualities, qualityValue]);

    const resolvedSrc =
      activeQuality?.quality.src ?? srcProp ?? qualities[0]?.src ?? "";

    const kind = detectKind(resolvedSrc, kindProp ?? undefined);
    const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const labelId = useId();
    const captionMenuId = useId();
    const qualityMenuId = useId();

    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(clampVolume(defaultVolume));
    const [muted, setMuted] = useState(Boolean(mutedProp));
    const [seeking, setSeeking] = useState(false);
    const [openMenu, setOpenMenu] = useState<"caption" | "quality" | null>(null);

    const [uncontrolledCaption, setUncontrolledCaption] =
      useState<MediaPlayerCaptionValue>(() =>
        hasCaptions ? resolveDefaultCaption(captions, defaultCaption) : "off",
      );
    const captionValue = captionProp ?? uncontrolledCaption;

    const pendingRestore = useRef<{ time: number; play: boolean } | null>(null);

    const setCaptionValue = useCallback(
      (next: MediaPlayerCaptionValue) => {
        if (captionProp === undefined) setUncontrolledCaption(next);
        onCaptionChange?.(next);
      },
      [captionProp, onCaptionChange],
    );

    const setQualityValue = useCallback(
      (id: string) => {
        const idx = qualities.findIndex(
          (q, i) => qualityId(q, i) === id || q.label === id,
        );
        if (idx < 0) return;
        const q = qualities[idx]!;
        const nextId = qualityId(q, idx);
        if (nextId === qualityValue) {
          setOpenMenu(null);
          return;
        }

        const el = mediaRef.current;
        pendingRestore.current = {
          time: el?.currentTime ?? currentTime,
          play: el ? !el.paused : playing,
        };

        if (qualityProp === undefined) setUncontrolledQuality(nextId);
        onQualityChange?.(nextId, q);
        setOpenMenu(null);
      },
      [
        currentTime,
        onQualityChange,
        playing,
        qualities,
        qualityProp,
        qualityValue,
      ],
    );

    useImperativeHandle(
      ref,
      () => ({
        play: () => mediaRef.current?.play(),
        pause: () => mediaRef.current?.pause(),
        seek: (time: number) => {
          if (mediaRef.current) {
            mediaRef.current.currentTime = time;
            setCurrentTime(time);
          }
        },
        getMediaElement: () => mediaRef.current,
        setCaption: setCaptionValue,
        setQuality: setQualityValue,
      }),
      [setCaptionValue, setQualityValue],
    );

    useEffect(() => {
      const el = mediaRef.current;
      if (!el) return;
      el.volume = volume;
    }, [volume]);

    useEffect(() => {
      const el = mediaRef.current;
      if (!el) return;
      el.muted = muted;
    }, [muted]);

    // Apply text track modes when caption selection changes
    useEffect(() => {
      const el = mediaRef.current;
      if (!el || kind !== "video") return;

      const apply = () => {
        const tracks = el.textTracks;
        for (let i = 0; i < tracks.length; i++) {
          const track = tracks[i]!;
          const meta = captions[i];
          const id = meta ? captionTrackId(meta, i) : `track-${i}`;
          const isActive = captionValue !== "off" && id === captionValue;
          track.mode = isActive ? "showing" : "disabled";
        }
      };

      apply();
      el.addEventListener("loadedmetadata", apply);
      return () => el.removeEventListener("loadedmetadata", apply);
    }, [captionValue, captions, kind, resolvedSrc]);

    // Restore position after quality switch
    useEffect(() => {
      const el = mediaRef.current;
      const pending = pendingRestore.current;
      if (!el || !pending) return;

      const restore = () => {
        try {
          el.currentTime = pending.time;
          setCurrentTime(pending.time);
          if (pending.play) {
            void el.play().catch(() => undefined);
          }
        } finally {
          pendingRestore.current = null;
        }
      };

      if (el.readyState >= 1) {
        restore();
      } else {
        el.addEventListener("loadedmetadata", restore, { once: true });
        return () => el.removeEventListener("loadedmetadata", restore);
      }
    }, [resolvedSrc]);

    // Close menus on outside click
    useEffect(() => {
      if (!openMenu) return;
      const onPointer = (event: PointerEvent) => {
        const root = rootRef.current;
        if (root && !root.contains(event.target as Node)) {
          setOpenMenu(null);
        }
      };
      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") setOpenMenu(null);
      };
      document.addEventListener("pointerdown", onPointer);
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("pointerdown", onPointer);
        document.removeEventListener("keydown", onKey);
      };
    }, [openMenu]);

    const togglePlay = useCallback(async () => {
      const el = mediaRef.current;
      if (!el) return;
      if (el.paused) {
        try {
          await el.play();
        } catch {
          /* autoplay / gesture restrictions */
        }
      } else {
        el.pause();
      }
    }, []);

    const toggleMute = useCallback(() => {
      setMuted((m) => {
        const next = !m;
        onVolumeChange?.(volume, next);
        return next;
      });
    }, [onVolumeChange, volume]);

    const toggleFullscreen = useCallback(async () => {
      const root = rootRef.current;
      if (!root) return;
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        } else {
          await root.requestFullscreen();
        }
      } catch {
        /* fullscreen not available */
      }
    }, []);

    const handleSeek = useCallback(
      (value: number) => {
        const el = mediaRef.current;
        if (!el || !Number.isFinite(duration) || duration <= 0) return;
        const next = Math.min(duration, Math.max(0, value));
        el.currentTime = next;
        setCurrentTime(next);
        onTimeUpdate?.(next, duration);
      },
      [duration, onTimeUpdate],
    );

    const onKeyDown = useCallback(
      (event: ReactKeyboardEvent<HTMLDivElement>) => {
        const el = mediaRef.current;
        if (!el) return;
        if (event.key === " " || event.key === "k") {
          event.preventDefault();
          void togglePlay();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          handleSeek(el.currentTime + 5);
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          handleSeek(el.currentTime - 5);
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          setVolume((v) => {
            const next = clampVolume(v + 0.05);
            onVolumeChange?.(next, muted);
            return next;
          });
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          setVolume((v) => {
            const next = clampVolume(v - 0.05);
            onVolumeChange?.(next, muted);
            return next;
          });
        } else if (event.key === "m") {
          event.preventDefault();
          toggleMute();
        } else if (event.key === "c" && kind === "video" && hasCaptions && showCaptions) {
          event.preventDefault();
          if (captionValue === "off") {
            const first = captions[0];
            if (first) setCaptionValue(captionTrackId(first, 0));
          } else {
            setCaptionValue("off");
          }
        } else if (event.key === "f" && kind === "video" && showFullscreen) {
          event.preventDefault();
          void toggleFullscreen();
        }
      },
      [
        captionValue,
        captions,
        handleSeek,
        hasCaptions,
        kind,
        muted,
        onVolumeChange,
        setCaptionValue,
        showCaptions,
        showFullscreen,
        toggleFullscreen,
        toggleMute,
        togglePlay,
      ],
    );

    const progress = useMemo(() => {
      if (!duration || duration <= 0) return 0;
      return (currentTime / duration) * 100;
    }, [currentTime, duration]);

    const { className: mediaClassName, ...restMediaProps } = mediaProps ?? {};

    const mediaCommon = {
      ref: mediaRef as never,
      src: resolvedSrc,
      autoPlay,
      loop,
      muted,
      preload,
      playsInline: kind === "video" ? playsInline : undefined,
      poster: kind === "video" ? poster : undefined,
      crossOrigin: hasCaptions ? ("anonymous" as const) : undefined,
      onPlay: () => {
        setPlaying(true);
        onPlay?.();
      },
      onPause: () => {
        setPlaying(false);
        onPause?.();
      },
      onEnded: () => {
        setPlaying(false);
        onEnded?.();
      },
      onLoadedMetadata: () => {
        const el = mediaRef.current;
        if (el) setDuration(el.duration || 0);
      },
      onDurationChange: () => {
        const el = mediaRef.current;
        if (el) setDuration(el.duration || 0);
      },
      onTimeUpdate: () => {
        if (seeking) return;
        const el = mediaRef.current;
        if (!el) return;
        setCurrentTime(el.currentTime);
        onTimeUpdate?.(el.currentTime, el.duration || duration);
      },
      onVolumeChange: () => {
        const el = mediaRef.current;
        if (!el) return;
        setVolume(el.volume);
        setMuted(el.muted);
        onVolumeChange?.(el.volume, el.muted);
      },
      className:
        kind === "video"
          ? cn("block w-full bg-black object-contain", mediaClassName)
          : cn("sr-only", mediaClassName),
      ...restMediaProps,
    };

    const activeQualityLabel = activeQuality?.quality.label;
    const captionsActive = captionValue !== "off";
    const showCcControl = kind === "video" && hasCaptions && showCaptions;
    const showQualityControl = hasQualities && showQuality;

    if (!resolvedSrc) {
      return (
        <div
          data-slot="media-player"
          className={cn(mediaPlayerVariants({ variant, kind: kindProp ?? "video", className }), "items-center justify-center p-6 text-sm text-muted-foreground")}
          {...props}
        >
          No media source
        </div>
      );
    }

    return (
      <div
        ref={rootRef}
        data-slot="media-player"
        data-kind={kind}
        data-playing={playing || undefined}
        data-menu-open={openMenu ? true : undefined}
        tabIndex={0}
        role="region"
        aria-labelledby={title ? labelId : undefined}
        aria-label={title ? undefined : kind === "audio" ? "Audio player" : "Video player"}
        className={cn(mediaPlayerVariants({ variant, kind, className }))}
        onKeyDown={onKeyDown}
        {...props}
      >
        {kind === "video" ? (
          <video {...mediaCommon} key={resolvedSrc}>
            {captions.map((track, index) => (
              <track
                key={captionTrackId(track, index)}
                kind={track.kind ?? "captions"}
                src={track.src}
                srcLang={track.srcLang}
                label={track.label}
                default={track.default}
              />
            ))}
          </video>
        ) : (
          <audio {...mediaCommon} key={resolvedSrc} />
        )}

        {kind === "audio" ? (
          <div className="flex items-center gap-3 px-4 pb-1 pt-4">
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-xl",
                "border border-[var(--glass-chrome-border)]",
                "bg-[color-mix(in_oklch,var(--primary)_18%,transparent)]",
                "text-[var(--glass-chrome-fg)]",
              )}
              aria-hidden="true"
            >
              <PlayIcon className="size-5 opacity-80" />
            </div>
            <div className="min-w-0 flex-1">
              {title ? (
                <p id={labelId} className="truncate text-sm font-semibold glass-chrome-text">
                  {title}
                </p>
              ) : (
                <p id={labelId} className="truncate text-sm font-semibold glass-chrome-text">
                  Audio
                </p>
              )}
              {subtitle ? (
                <p className="truncate text-xs glass-chrome-text-muted">{subtitle}</p>
              ) : null}
            </div>
          </div>
        ) : null}

        {kind === "video" && title ? (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] p-3 opacity-0 transition-opacity group-hover/media:opacity-100 group-focus-within/media:opacity-100 data-[playing=false]:opacity-100">
            <p id={labelId} className="truncate text-sm font-medium text-white drop-shadow">
              {title}
            </p>
            {subtitle ? (
              <p className="truncate text-xs text-white/80 drop-shadow">{subtitle}</p>
            ) : null}
          </div>
        ) : null}

        <div
          data-slot="media-player-controls"
          data-playing={playing}
          data-menu-open={openMenu ? true : undefined}
          className={cn(mediaPlayerControlsVariants({ kind }))}
        >
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor={`${labelId}-seek`}>
              Seek
            </label>
            <input
              id={`${labelId}-seek`}
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={Number.isFinite(currentTime) ? currentTime : 0}
              disabled={!duration}
              aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
              onPointerDown={() => setSeeking(true)}
              onPointerUp={() => setSeeking(false)}
              onChange={(event) => handleSeek(Number(event.target.value))}
              className={cn(
                "h-1.5 w-full cursor-pointer appearance-none rounded-full",
                "bg-[color-mix(in_oklch,white_22%,transparent)]",
                "[&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none",
                "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white",
                "[&::-webkit-slider-thumb]:shadow-md",
                "[&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:rounded-full",
                "[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white",
                focusRing,
              )}
              style={{
                background: `linear-gradient(to right, color-mix(in oklch, var(--primary) 85%, white) ${progress}%, color-mix(in oklch, white 22%, transparent) ${progress}%)`,
              }}
            />
          </div>

          <div className="flex items-center gap-1">
            <ControlButton
              label={playing ? "Pause" : "Play"}
              onClick={() => void togglePlay()}
            >
              {playing ? (
                <PauseIcon className="size-4" />
              ) : (
                <PlayIcon className="size-4" />
              )}
            </ControlButton>

            <span className="min-w-[5.5rem] px-1 text-xs tabular-nums opacity-90">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="relative ml-auto flex items-center gap-1">
              {showVolume ? (
                <>
                  <ControlButton
                    label={muted || volume === 0 ? "Unmute" : "Mute"}
                    onClick={toggleMute}
                  >
                    <VolumeIcon className="size-4" muted={muted || volume === 0} />
                  </ControlButton>
                  <label className="sr-only" htmlFor={`${labelId}-volume`}>
                    Volume
                  </label>
                  <input
                    id={`${labelId}-volume`}
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={muted ? 0 : volume}
                    onChange={(event) => {
                      const next = clampVolume(Number(event.target.value));
                      setVolume(next);
                      setMuted(next === 0);
                      onVolumeChange?.(next, next === 0);
                    }}
                    className={cn(
                      "hidden h-1.5 w-20 cursor-pointer appearance-none rounded-full sm:block",
                      "bg-[color-mix(in_oklch,white_22%,transparent)]",
                      "[&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none",
                      "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white",
                      "[&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:rounded-full",
                      "[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white",
                      focusRing,
                    )}
                  />
                </>
              ) : null}

              {showCcControl ? (
                <div className="relative">
                  <ControlButton
                    label={
                      captionsActive
                        ? `Captions: ${captions.find((t, i) => captionTrackId(t, i) === captionValue)?.label ?? "On"}`
                        : "Captions off"
                    }
                    pressed={captionsActive}
                    expanded={openMenu === "caption"}
                    controls={captionMenuId}
                    onClick={() =>
                      setOpenMenu((m) => (m === "caption" ? null : "caption"))
                    }
                  >
                    <CcIcon className="size-4" active={captionsActive} />
                  </ControlButton>
                  {openMenu === "caption" ? (
                    <div
                      id={captionMenuId}
                      role="menu"
                      aria-label="Captions"
                      className={menuPanelClass}
                    >
                      <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide opacity-60">
                        Captions
                      </p>
                      <MenuOption
                        selected={captionValue === "off"}
                        onSelect={() => {
                          setCaptionValue("off");
                          setOpenMenu(null);
                        }}
                      >
                        Off
                      </MenuOption>
                      {captions.map((track, index) => {
                        const id = captionTrackId(track, index);
                        return (
                          <MenuOption
                            key={id}
                            selected={captionValue === id}
                            onSelect={() => {
                              setCaptionValue(id);
                              setOpenMenu(null);
                            }}
                          >
                            {track.label}
                            {track.srcLang ? (
                              <span className="ml-1 opacity-60">({track.srcLang})</span>
                            ) : null}
                          </MenuOption>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {showQualityControl ? (
                <div className="relative">
                  <ControlButton
                    label={`Quality: ${activeQualityLabel ?? "Auto"}`}
                    expanded={openMenu === "quality"}
                    controls={qualityMenuId}
                    className="min-w-9 gap-0 px-2 text-[10px] font-semibold tabular-nums"
                    onClick={() =>
                      setOpenMenu((m) => (m === "quality" ? null : "quality"))
                    }
                  >
                    <span className="sr-only sm:not-sr-only sm:mr-1">
                      {activeQualityLabel ?? "HD"}
                    </span>
                    <SettingsIcon className="size-4 sm:hidden" />
                    <SettingsIcon className="hidden size-3.5 opacity-80 sm:inline" />
                  </ControlButton>
                  {openMenu === "quality" ? (
                    <div
                      id={qualityMenuId}
                      role="menu"
                      aria-label="Quality"
                      className={menuPanelClass}
                    >
                      <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide opacity-60">
                        Quality
                      </p>
                      {qualities.map((q, index) => {
                        const id = qualityId(q, index);
                        return (
                          <MenuOption
                            key={id}
                            selected={qualityValue === id || qualityValue === q.label}
                            onSelect={() => setQualityValue(id)}
                          >
                            {q.label}
                          </MenuOption>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {kind === "video" && showFullscreen ? (
                <ControlButton label="Toggle fullscreen" onClick={() => void toggleFullscreen()}>
                  <FullscreenIcon className="size-4" />
                </ControlButton>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  },
);
MediaPlayer.displayName = "MediaPlayer";

function clampVolume(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export {
  MediaPlayer,
  mediaPlayerVariants,
  mediaPlayerControlsVariants,
  formatTime as formatMediaTime,
  detectKind as detectMediaKind,
};
