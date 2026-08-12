"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Banner, type BannerProps } from "./banner";

export interface OfflineBannerProps
  extends Omit<BannerProps, "variant" | "children" | "title" | "open"> {
  /** Online message briefly after reconnect. Null to hide. */
  onlineMessage?: ReactNode | null;
  offlineTitle?: ReactNode;
  offlineMessage?: ReactNode;
  onlineTitle?: ReactNode;
  /** ms to show online confirmation. Default 3200. */
  onlineDuration?: number;
  /** Force offline for demos/tests. */
  forceOffline?: boolean;
}

const OfflineBanner = forwardRef<HTMLDivElement, OfflineBannerProps>(
  (
    {
      offlineTitle = "You're offline",
      offlineMessage = "Some features may be unavailable until you reconnect.",
      onlineTitle = "Back online",
      onlineMessage = "Connection restored.",
      onlineDuration = 3200,
      forceOffline,
      ...props
    },
    ref,
  ) => {
    const [online, setOnline] = useState(true);
    const [showOnlineFlash, setShowOnlineFlash] = useState(false);
    const wasOfflineRef = useRef(false);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const sync = () => setOnline(navigator.onLine);
      sync();
      window.addEventListener("online", sync);
      window.addEventListener("offline", sync);
      return () => {
        window.removeEventListener("online", sync);
        window.removeEventListener("offline", sync);
      };
    }, []);

    const isOffline = forceOffline ?? !online;

    useEffect(() => {
      if (forceOffline) {
        wasOfflineRef.current = true;
        setShowOnlineFlash(false);
        return;
      }
      if (!online) {
        wasOfflineRef.current = true;
        setShowOnlineFlash(false);
        return;
      }
      // Only flash "back online" after a real offline stretch
      if (wasOfflineRef.current && online) {
        wasOfflineRef.current = false;
        setShowOnlineFlash(true);
        const t = window.setTimeout(
          () => setShowOnlineFlash(false),
          onlineDuration,
        );
        return () => window.clearTimeout(t);
      }
    }, [online, onlineDuration, forceOffline]);

    if (isOffline) {
      return (
        <Banner
          ref={ref}
          variant="warning"
          position="sticky"
          title={offlineTitle}
          data-slot="offline-banner"
          data-state="offline"
          {...props}
        >
          {offlineMessage}
        </Banner>
      );
    }

    if (showOnlineFlash && onlineMessage !== null) {
      return (
        <Banner
          ref={ref}
          variant="success"
          position="sticky"
          title={onlineTitle}
          data-slot="offline-banner"
          data-state="online"
          dismissible
          {...props}
        >
          {onlineMessage}
        </Banner>
      );
    }

    return null;
  },
);
OfflineBanner.displayName = "OfflineBanner";

export { OfflineBanner };
