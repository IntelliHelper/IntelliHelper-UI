"use client";

import {
  ImageEditor,
  ImagePreview,
  ImagePreviewGallery,
  ImagePreviewThumb,
  MediaPlayer,
  type ImagePreviewItem,
} from "@intelli/ui";
import { useMemo, useState } from "react";

const DEMO_IMAGES: ImagePreviewItem[] = [
  {
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    alt: "Abstract fluid art",
    caption: "Abstract fluid gradients",
  },
  {
    src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
    alt: "Color gradient mesh",
    caption: "Soft mesh lighting",
  },
  {
    src: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80",
    alt: "Purple blue gradient",
    caption: "Deep purple chrome",
  },
  {
    src: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80",
    alt: "Geometric abstract",
    caption: "Geometric forms",
  },
];

const EDITOR_SRC =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80";

/** Sample open-source media (MDN / W3C commons-friendly demos). */
const SAMPLE_VIDEO =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const SAMPLE_AUDIO =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3";

export function ImagePreviewDemo() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <div className="w-full max-w-lg space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {DEMO_IMAGES.map((item, i) => (
          <ImagePreviewThumb
            key={item.src}
            src={item.src}
            alt={item.alt}
            index={i}
            className="aspect-square"
            onOpen={(next) => {
              setIndex(next);
              setOpen(true);
            }}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Click a thumbnail to open the lightbox. Arrow keys navigate; scroll to
        zoom.
      </p>
      <ImagePreview
        images={DEMO_IMAGES}
        open={open}
        onOpenChange={setOpen}
        index={index}
        onIndexChange={setIndex}
      />
    </div>
  );
}

export function ImagePreviewGalleryDemo() {
  return (
    <div className="w-full max-w-xl">
      <ImagePreviewGallery images={DEMO_IMAGES} thumbClassName="aspect-square" />
    </div>
  );
}

/** Demo WebVTT (blob URL) so CC works without a remote caption file. */
function useDemoCaptions() {
  return useMemo(() => {
    const vttEn = `WEBVTT

00:00:00.000 --> 00:00:01.800
A flower blooms in spring.

00:00:01.800 --> 00:00:03.600
Petals open toward the light.

00:00:03.600 --> 00:00:06.000
Closed captions demo — English.
`;
    const vttEs = `WEBVTT

00:00:00.000 --> 00:00:01.800
Una flor florece en primavera.

00:00:01.800 --> 00:00:03.600
Los pétalos se abren hacia la luz.

00:00:03.600 --> 00:00:06.000
Demostración de subtítulos — Español.
`;
    const en = URL.createObjectURL(new Blob([vttEn], { type: "text/vtt" }));
    const es = URL.createObjectURL(new Blob([vttEs], { type: "text/vtt" }));
    return [
      {
        id: "en",
        src: en,
        label: "English",
        srcLang: "en",
        kind: "captions" as const,
        default: true,
      },
      {
        id: "es",
        src: es,
        label: "Español",
        srcLang: "es",
        kind: "subtitles" as const,
      },
    ];
  }, []);
}

export function MediaPlayerVideoDemo() {
  const captions = useDemoCaptions();

  return (
    <div className="w-full min-w-0 max-w-xl">
      <MediaPlayer
        kind="video"
        src={SAMPLE_VIDEO}
        title="Sample clip"
        subtitle="CC + quality selector — press C for captions"
        poster="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=60"
        captions={captions}
        defaultCaption="en"
        qualities={[
          { id: "1080", label: "1080p", src: SAMPLE_VIDEO, height: 1080 },
          { id: "720", label: "720p", src: SAMPLE_VIDEO, height: 720 },
          { id: "480", label: "480p", src: SAMPLE_VIDEO, height: 480 },
        ]}
        defaultQuality="720"
        className="min-w-0"
      />
      <p className="mt-2 text-xs text-muted-foreground">
        Demo uses the same file for each quality label — wire distinct bitrates
        in production. Cross-origin captions need{" "}
        <code className="rounded bg-muted px-1">crossOrigin=&quot;anonymous&quot;</code>{" "}
        when tracks are remote. On touch devices, tap the video to show or hide
        controls while playing.
      </p>
    </div>
  );
}

export function MediaPlayerAudioDemo() {
  return (
    <div className="w-full min-w-0 max-w-md">
      <MediaPlayer
        kind="audio"
        src={SAMPLE_AUDIO}
        title="T-Rex roar"
        subtitle="CC0 sample audio"
        variant="elevated"
        className="min-w-0"
      />
    </div>
  );
}

export function ImageEditorDemo() {
  const [lastExport, setLastExport] = useState<string | null>(null);
  const src = useMemo(() => EDITOR_SRC, []);

  return (
    <div className="w-full min-w-0 max-w-xl space-y-3">
      <ImageEditor
        src={src}
        alt="Edit sample"
        defaultAspect="free"
        className="min-w-0"
        onExport={(blob) => {
          setLastExport(`${(blob.size / 1024).toFixed(1)} KB · ${blob.type}`);
        }}
      />
      {lastExport ? (
        <p className="text-xs text-muted-foreground">Last export: {lastExport}</p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Crop (aspect chips lock ratio while resizing), filter, or rotate —
          then Export to download a PNG.
        </p>
      )}
    </div>
  );
}
