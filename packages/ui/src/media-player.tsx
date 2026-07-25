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
  type SyntheticEvent,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import {
  CcIcon,
  FullscreenIcon,
  PauseIcon,
  PlayIcon,
  SettingsIcon,
  VolumeIcon,
} from "./media-player-icons";
import {
  captionTrackId,
  clampVolume,
  detectMediaKind,
  formatMediaTime,
  matchCaptionTrackId,
  qualityId,
  resolveDefaultCaption,
  resolveDefaultQuality,
  type MediaPlayerCaptionTrack,
  type MediaPlayerCaptionValue,
  type MediaPlayerKind,
  type MediaPlayerQuality,
} from "./media-player-utils";

export type {
  MediaPlayerCaptionTrack,
  MediaPlayerCaptionValue,
  MediaPlayerKind,
  MediaPlayerQuality,
} from "./media-player-utils";

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

const controlBtnClass = cn(
  "inline-flex size-9 shrink-0 items-center justify-center rounded-full text-current",
  "transition-[background,transform,opacity] duration-[var(--duration-fast)]",
  "hover:bg-[color-mix(in_oklch,white_14%,transparent)] active:scale-95",
  "disabled:pointer-events-none disabled:opacity-40",
  "data-[pressed=true]:bg-[color-mix(in_oklch,white_16%,transparent)]",
  focusRing,
);

function ControlButton({
  label,
  onClick,
  children,
  className,
  disabled,
  pressed,
}: {
  label: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      data-pressed={pressed || undefined}
      disabled={disabled}
      onClick={onClick}
      className={cn(controlBtnClass, className)}
    >
      {children}
    </button>
  );
}

const rangeClass = cn(
  "h-1.5 cursor-pointer appearance-none rounded-full",
  "bg-[color-mix(in_oklch,white_22%,transparent)]",
  "[&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none",
  "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white",
  "[&::-webkit-slider-thumb]:shadow-md",
  "[&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:rounded-full",
  "[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white",
  focusRing,
);

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
  /**
   * CORS mode for the media element. Set to `"anonymous"` when using
   * cross-origin caption tracks (WebVTT) so text tracks can load.
   * Not applied automatically — same-origin media often fails if CORS
   * headers are missing.
   */
  crossOrigin?: MediaHTMLAttributes<HTMLVideoElement>["crossOrigin"];
  showFullscreen?: boolean;
  showVolume?: boolean;
  showCaptions?: boolean;
  showQuality?: boolean;
  defaultVolume?: number;
  captions?: MediaPlayerCaptionTrack[];
  caption?: MediaPlayerCaptionValue;
  defaultCaption?: MediaPlayerCaptionValue;
  onCaptionChange?: (value: MediaPlayerCaptionValue) => void;
  qualities?: MediaPlayerQuality[];
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
    | "src"
    | "controls"
    | "autoPlay"
    | "loop"
    | "muted"
    | "poster"
    | "preload"
    | "playsInline"
    | "crossOrigin"
    | "children"
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
      crossOrigin,
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
      return {
        quality: qualities[i]!,
        id: qualityId(qualities[i]!, i),
        index: i,
      };
    }, [hasQualities, qualities, qualityValue]);

    const resolvedSrc =
      activeQuality?.quality.src ?? srcProp ?? qualities[0]?.src ?? "";

    const kind = detectMediaKind(resolvedSrc, kindProp ?? undefined);
    const mediaRef = useRef<HTMLMediaElement | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const labelId = useId();

    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(clampVolume(defaultVolume));
    const [muted, setMuted] = useState(Boolean(mutedProp));
    const [seeking, setSeeking] = useState(false);
    const [captionMenuOpen, setCaptionMenuOpen] = useState(false);
    const [qualityMenuOpen, setQualityMenuOpen] = useState(false);
    const menuOpen = captionMenuOpen || qualityMenuOpen;

    const [uncontrolledCaption, setUncontrolledCaption] =
      useState<MediaPlayerCaptionValue>(() =>
        hasCaptions ? resolveDefaultCaption(captions, defaultCaption) : "off",
      );
    const captionValue = captionProp ?? uncontrolledCaption;

    const pendingRestore = useRef<{ time: number; play: boolean } | null>(
      null,
    );
    const prevQualityRef = useRef(qualityValue);

    // Capture playback position before any quality-driven src change
    // (controlled prop or internal setQuality).
    if (hasQualities && prevQualityRef.current !== qualityValue) {
      const el = mediaRef.current;
      if (el && !pendingRestore.current) {
        pendingRestore.current = {
          time: el.currentTime,
          play: !el.paused && !el.ended,
        };
      }
      prevQualityRef.current = qualityValue;
    }

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
        if (nextId === qualityValue) return;

        if (qualityProp === undefined) setUncontrolledQuality(nextId);
        onQualityChange?.(nextId, q);
      },
      [onQualityChange, qualities, qualityProp, qualityValue],
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

    useEffect(() => {
      const el = mediaRef.current;
      if (!el || kind !== "video") return;

      const apply = () => {
        const tracks = el.textTracks;
        for (let i = 0; i < tracks.length; i++) {
          const track = tracks[i]!;
          const id = matchCaptionTrackId(track, captions, i);
          const isActive = captionValue !== "off" && id === captionValue;
          track.mode = isActive ? "showing" : "disabled";
        }
      };

      apply();
      el.addEventListener("loadedmetadata", apply);
      return () => el.removeEventListener("loadedmetadata", apply);
    }, [captionValue, captions, kind, resolvedSrc]);

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
        } else if (
          event.key === "c" &&
          kind === "video" &&
          hasCaptions &&
          showCaptions
        ) {
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

    const bindMediaRef = useCallback((node: HTMLMediaElement | null) => {
      mediaRef.current = node;
    }, []);

    const onMediaPlay = useCallback(() => {
      setPlaying(true);
      onPlay?.();
    }, [onPlay]);

    const onMediaPause = useCallback(() => {
      setPlaying(false);
      onPause?.();
    }, [onPause]);

    const onMediaEnded = useCallback(() => {
      setPlaying(false);
      onEnded?.();
    }, [onEnded]);

    const onMediaLoadedMetadata = useCallback(
      (event: SyntheticEvent<HTMLMediaElement>) => {
        setDuration(event.currentTarget.duration || 0);
      },
      [],
    );

    const onMediaDurationChange = useCallback(
      (event: SyntheticEvent<HTMLMediaElement>) => {
        setDuration(event.currentTarget.duration || 0);
      },
      [],
    );

    const onMediaTimeUpdate = useCallback(
      (event: SyntheticEvent<HTMLMediaElement>) => {
        if (seeking) return;
        const el = event.currentTarget;
        setCurrentTime(el.currentTime);
        onTimeUpdate?.(el.currentTime, el.duration || duration);
      },
      [duration, onTimeUpdate, seeking],
    );

    const onMediaVolumeChange = useCallback(
      (event: SyntheticEvent<HTMLMediaElement>) => {
        const el = event.currentTarget;
        setVolume(el.volume);
        setMuted(el.muted);
        onVolumeChange?.(el.volume, el.muted);
      },
      [onVolumeChange],
    );

    const mediaShared = {
      src: resolvedSrc,
      autoPlay,
      loop,
      muted,
      preload,
      crossOrigin,
      onPlay: onMediaPlay,
      onPause: onMediaPause,
      onEnded: onMediaEnded,
      onLoadedMetadata: onMediaLoadedMetadata,
      onDurationChange: onMediaDurationChange,
      onTimeUpdate: onMediaTimeUpdate,
      onVolumeChange: onMediaVolumeChange,
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
          className={cn(
            mediaPlayerVariants({
              variant,
              kind: kindProp ?? "video",
              className,
            }),
            "items-center justify-center p-6 text-sm text-muted-foreground",
          )}
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
        data-menu-open={menuOpen ? true : undefined}
        tabIndex={0}
        role="region"
        aria-labelledby={title ? labelId : undefined}
        aria-label={
          title
            ? undefined
            : kind === "audio"
              ? "Audio player"
              : "Video player"
        }
        className={cn(mediaPlayerVariants({ variant, kind, className }))}
        onKeyDown={onKeyDown}
        {...props}
      >
        {kind === "video" ? (
          <video
            key={resolvedSrc}
            ref={bindMediaRef}
            playsInline={playsInline}
            poster={poster}
            className={cn("block w-full bg-black object-contain", mediaClassName)}
            {...mediaShared}
          >
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
          <audio
            key={resolvedSrc}
            ref={bindMediaRef}
            className={cn("sr-only", mediaClassName)}
            {...mediaShared}
          />
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
              <p
                id={labelId}
                className="truncate text-sm font-semibold glass-chrome-text"
              >
                {title ?? "Audio"}
              </p>
              {subtitle ? (
                <p className="truncate text-xs glass-chrome-text-muted">
                  {subtitle}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        {kind === "video" && title ? (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] p-3 opacity-0 transition-opacity group-hover/media:opacity-100 group-focus-within/media:opacity-100 data-[playing=false]:opacity-100">
            <p
              id={labelId}
              className="truncate text-sm font-medium text-white drop-shadow"
            >
              {title}
            </p>
            {subtitle ? (
              <p className="truncate text-xs text-white/80 drop-shadow">
                {subtitle}
              </p>
            ) : null}
          </div>
        ) : null}

        <div
          data-slot="media-player-controls"
          data-playing={playing}
          data-menu-open={menuOpen ? true : undefined}
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
              aria-valuetext={`${formatMediaTime(currentTime)} of ${formatMediaTime(duration)}`}
              onPointerDown={() => setSeeking(true)}
              onPointerUp={() => setSeeking(false)}
              onChange={(event) => handleSeek(Number(event.target.value))}
              className={cn(rangeClass, "w-full")}
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
              {formatMediaTime(currentTime)} / {formatMediaTime(duration)}
            </span>

            <div className="relative ml-auto flex items-center gap-1">
              {showVolume ? (
                <>
                  <ControlButton
                    label={muted || volume === 0 ? "Unmute" : "Mute"}
                    onClick={toggleMute}
                  >
                    <VolumeIcon
                      className="size-4"
                      muted={muted || volume === 0}
                    />
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
                    className={cn(rangeClass, "hidden w-20 sm:block", "[&::-webkit-slider-thumb]:size-3 [&::-moz-range-thumb]:size-3")}
                  />
                </>
              ) : null}

              {showCcControl ? (
                <DropdownMenu
                  open={captionMenuOpen}
                  onOpenChange={setCaptionMenuOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-label={
                        captionsActive
                          ? `Captions: ${captions.find((t, i) => captionTrackId(t, i) === captionValue)?.label ?? "On"}`
                          : "Captions off"
                      }
                      aria-pressed={captionsActive}
                      data-pressed={captionsActive || undefined}
                      className={controlBtnClass}
                    >
                      <CcIcon className="size-4" active={captionsActive} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    side="top"
                    variant="chrome"
                    className="min-w-[9.5rem]"
                  >
                    <DropdownMenuLabel>Captions</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={captionValue}
                      onValueChange={(value) =>
                        setCaptionValue(value as MediaPlayerCaptionValue)
                      }
                    >
                      <DropdownMenuRadioItem value="off">
                        Off
                      </DropdownMenuRadioItem>
                      {captions.map((track, index) => {
                        const id = captionTrackId(track, index);
                        return (
                          <DropdownMenuRadioItem key={id} value={id}>
                            {track.label}
                            {track.srcLang ? (
                              <span className="ml-1 opacity-60">
                                ({track.srcLang})
                              </span>
                            ) : null}
                          </DropdownMenuRadioItem>
                        );
                      })}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}

              {showQualityControl ? (
                <DropdownMenu
                  open={qualityMenuOpen}
                  onOpenChange={setQualityMenuOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-label={`Quality: ${activeQualityLabel ?? "Auto"}`}
                      className={cn(
                        controlBtnClass,
                        "min-w-9 gap-0 px-2 text-[10px] font-semibold tabular-nums",
                      )}
                    >
                      <span className="sr-only sm:not-sr-only sm:mr-1">
                        {activeQualityLabel ?? "HD"}
                      </span>
                      <SettingsIcon className="size-4 sm:hidden" />
                      <SettingsIcon className="hidden size-3.5 opacity-80 sm:inline" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    side="top"
                    variant="chrome"
                    className="min-w-[9.5rem]"
                  >
                    <DropdownMenuLabel>Quality</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={
                        activeQuality?.id ??
                        qualityValue ??
                        qualityId(qualities[0]!, 0)
                      }
                      onValueChange={setQualityValue}
                    >
                      {qualities.map((q, index) => {
                        const id = qualityId(q, index);
                        return (
                          <DropdownMenuRadioItem key={id} value={id}>
                            {q.label}
                          </DropdownMenuRadioItem>
                        );
                      })}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}

              {kind === "video" && showFullscreen ? (
                <ControlButton
                  label="Toggle fullscreen"
                  onClick={() => void toggleFullscreen()}
                >
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

export {
  MediaPlayer,
  mediaPlayerVariants,
  mediaPlayerControlsVariants,
  formatMediaTime,
  detectMediaKind,
};
