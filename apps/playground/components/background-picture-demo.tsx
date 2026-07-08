"use client";

import { BackgroundPicturePicker } from "@intelli/ui";
import { usePlaygroundBackground } from "./playground-background-provider";

type BackgroundPictureDemoProps = {
  compact?: boolean;
};

export function BackgroundPictureDemo({ compact = false }: BackgroundPictureDemoProps) {
  const { background, setBackground } = usePlaygroundBackground();

  return (
    <div className="space-y-3">
      {!compact ? (
        <p className="text-xs text-muted-foreground">
          Pick a preset, upload your own image, or select none. Your choice
          applies to the entire playground behind the glass components.
        </p>
      ) : null}
      <BackgroundPicturePicker
        value={background}
        onValueChange={setBackground}
        columns={compact ? 3 : 4}
        size={compact ? "sm" : "default"}
      />
      <p className="text-xs text-muted-foreground">
        Current:{" "}
        <span className="font-medium text-foreground">
          {background.source === "none"
            ? "Default mesh"
            : background.source === "custom"
              ? "Custom upload"
              : background.presetId}
        </span>
      </p>
    </div>
  );
}