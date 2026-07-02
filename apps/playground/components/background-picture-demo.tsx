"use client";

import { BackgroundPicturePicker } from "@intelli/ui";
import { usePlaygroundBackground } from "./playground-background-provider";

export function BackgroundPictureDemo() {
  const { background, setBackground } = usePlaygroundBackground();

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Pick a preset, upload your own image, or select none. Your choice
        applies to the entire playground behind the glass components.
      </p>
      <BackgroundPicturePicker
        value={background}
        onValueChange={setBackground}
        columns={4}
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