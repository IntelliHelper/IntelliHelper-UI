import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          borderRadius: "36px",
          background:
            "linear-gradient(135deg, #0f172a 0%, #334155 55%, #64748b 100%)",
          color: "#f8fafc",
          fontSize: "92px",
          fontWeight: 700,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        I
      </div>
    ),
    { ...size },
  );
}