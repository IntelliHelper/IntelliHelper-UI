"use client";

import { useTheme, type MaterialId } from "@intelli/themes";
import { cn } from "@intelli/utils";

export function MaterialSwitcher() {
  const { material, setMaterial, availableMaterials } = useTheme();

  return (
    <div
      className="glass-chrome glass-chrome-capsule inline-flex w-full max-w-md p-1"
      role="group"
      aria-label="Surface material"
    >
      {availableMaterials.map((item) => {
        const isActive = material === item.id;
        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={isActive}
            title={item.description}
            onClick={() => setMaterial(item.id as MaterialId)}
            className={cn(
              "flex-1 rounded-full px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "glass-chrome-indicator text-foreground"
                : "glass-chrome-text-muted hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
