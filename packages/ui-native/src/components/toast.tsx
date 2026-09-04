import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { Text, View } from "react-native";
import { useTheme } from "../theme";

type ToastItem = { id: number; title: string; description?: string };

const ToastContext = createContext<{
  toast: (item: Omit<ToastItem, "id">) => void;
} | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const { theme, colors } = useTheme();
  const [items, setItems] = useState<ToastItem[]>([]);
  const toast = useCallback((item: Omit<ToastItem, "id">) => {
    const id = Date.now();
    setItems((prev) => [...prev, { id, ...item }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 2800);
  }, []);
  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: theme.spacing[4],
          right: theme.spacing[4],
          bottom: theme.spacing[8],
          gap: theme.spacing[2],
        }}
      >
        {items.map((item) => (
          <View
            key={item.id}
            style={{
              borderRadius: theme.radii.xl,
              padding: theme.spacing[3],
              backgroundColor: colors.glassChromeBgEnv,
              borderWidth: 1,
              borderColor: colors.glassChromeBorder,
            }}
          >
            <Text style={{ color: colors.foreground, fontWeight: theme.fontWeights.semibold }}>
              {item.title}
            </Text>
            {item.description ? (
              <Text style={{ color: colors.mutedForeground, marginTop: 2 }}>
                {item.description}
              </Text>
            ) : null}
          </View>
        ))}
      </View>
    </ToastContext.Provider>
  );
}
