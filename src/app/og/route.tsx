import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "en";

  const title = "DiffSheets";
  const tagline =
    locale === "es" ? "Compara hojas de cálculo al instante" : "Compare spreadsheets instantly";
  const subtitle =
    locale === "es"
      ? "Sube dos archivos Excel, CSV u ODS y visualiza cada diferencia."
      : "Upload two Excel, CSV, or ODS files and instantly see every difference.";
  const features =
    locale === "es" ? ["Excel", "CSV", "100% Privado"] : ["Excel", "CSV", "100% Private"];

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        background: "linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%)",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background:
            "radial-gradient(circle at 30% 40%, rgba(34, 197, 94, 0.12) 0%, transparent 50%)",
        }}
      />

      {/* Left content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "48px" }}>
          <svg width="72" height="72" viewBox="0 0 48 48" fill="none">
            <rect x="6" y="4" width="28" height="36" rx="4" fill="#3f3f46" />
            <rect x="14" y="8" width="28" height="36" rx="4" fill="#22c55e" />
            <rect x="14" y="8" width="20" height="32" rx="4" fill="#16a34a" fillOpacity="0.6" />
            <rect x="18" y="14" width="12" height="3" rx="1" fill="#fafafa" fillOpacity="0.9" />
            <rect x="18" y="20" width="8" height="3" rx="1" fill="#fafafa" fillOpacity="0.9" />
            <rect x="18" y="26" width="10" height="3" rx="1" fill="#fafafa" fillOpacity="0.9" />
          </svg>
          <span
            style={{
              fontSize: "44px",
              fontWeight: 700,
              color: "#fafafa",
              letterSpacing: "-0.02em",
            }}
          >
            Diff<span style={{ color: "#22c55e" }}>Sheets</span>
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "#fafafa",
            lineHeight: 1.15,
            marginBottom: "24px",
            letterSpacing: "-0.03em",
          }}
        >
          {locale === "es" ? "Compara hojas de cálculo." : "Compare spreadsheets."}
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {locale === "es" ? "Ve qué cambió." : "See what changed."}
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: "22px", color: "#94a3b8", maxWidth: "500px" }}>{subtitle}</p>
      </div>

      {/* Right - Demo window */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "60px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "420px",
            background: "#0f172a",
            borderRadius: "16px",
            border: "1px solid #334155",
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Window header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 18px",
              background: "#1e293b",
              borderBottom: "1px solid #334155",
            }}
          >
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#f59e0b" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#22c55e" }} />
          </div>

          {/* Demo content */}
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {/* Row 1 - Changed */}
            <div style={{ display: "flex", gap: "10px" }}>
              <div
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  background: "#1e293b",
                  borderRadius: "8px",
                  color: "#94a3b8",
                  fontSize: "15px",
                }}
              >
                Marketing
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  background: "rgba(245, 158, 11, 0.15)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  borderRadius: "8px",
                  color: "#fbbf24",
                  fontSize: "15px",
                }}
              >
                $65,000
              </div>
            </div>
            {/* Row 2 - Unchanged */}
            <div style={{ display: "flex", gap: "10px" }}>
              <div
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  background: "#1e293b",
                  borderRadius: "8px",
                  color: "#94a3b8",
                  fontSize: "15px",
                }}
              >
                Engineering
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  background: "#1e293b",
                  borderRadius: "8px",
                  color: "#94a3b8",
                  fontSize: "15px",
                }}
              >
                $120,000
              </div>
            </div>
            {/* Row 3 - Added */}
            <div style={{ display: "flex", gap: "10px" }}>
              <div
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  background: "rgba(34, 197, 94, 0.15)",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  borderRadius: "8px",
                  color: "#4ade80",
                  fontSize: "15px",
                }}
              >
                Operations
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  background: "rgba(34, 197, 94, 0.15)",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  borderRadius: "8px",
                  color: "#4ade80",
                  fontSize: "15px",
                }}
              >
                $45,000
              </div>
            </div>
            {/* Row 4 - Removed */}
            <div style={{ display: "flex", gap: "10px" }}>
              <div
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "8px",
                  color: "#f87171",
                  fontSize: "15px",
                }}
              >
                Sales
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "8px",
                  color: "#f87171",
                  fontSize: "15px",
                }}
              >
                $80,000
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* URL at bottom */}
      <p
        style={{
          position: "absolute",
          bottom: "40px",
          left: "80px",
          fontSize: "20px",
          color: "rgba(255,255,255,0.4)",
          fontWeight: 500,
        }}
      >
        diffsheets.com
      </p>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
