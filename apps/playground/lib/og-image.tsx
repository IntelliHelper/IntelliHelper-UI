import { readFileSync } from "fs";
import { join } from "path";

const logoSrc = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public/intellihelper.png"),
).toString("base64")}`;

type OgImageProps = {
  title: string;
  subtitle?: string;
  badge?: string;
};

export function OgImageLayout({ title, subtitle, badge }: OgImageProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "72px",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #334155 100%)",
        color: "#f8fafc",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {badge ? (
          <div
            style={{
              alignSelf: "flex-start",
              padding: "10px 18px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.18)",
              fontSize: "22px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {badge}
          </div>
        ) : null}
        <div
          style={{
            fontSize: "68px",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            maxWidth: "900px",
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              fontSize: "30px",
              lineHeight: 1.4,
              color: "rgba(248,250,252,0.78)",
              maxWidth: "820px",
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <img
            src={logoSrc}
            alt=""
            width={56}
            height={56}
            style={{ borderRadius: "12px" }}
          />
          <div style={{ fontSize: "34px", fontWeight: 600 }}>Intelli UI</div>
        </div>
        <div style={{ fontSize: "24px", color: "rgba(248,250,252,0.65)" }}>
          ui.intellihelper.in
        </div>
      </div>
    </div>
  );
}