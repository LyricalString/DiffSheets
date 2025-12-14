import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "en";

  const title = locale === "es" ? "DiffSheets" : "DiffSheets";
  const tagline =
    locale === "es" ? "Compara hojas de cálculo al instante" : "Compare spreadsheets instantly";
  const features =
    locale === "es" ? ["Excel", "CSV", "100% Privado"] : ["Excel", "CSV", "100% Private"];

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Background grid pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Glow effect */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.1) 30%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 60px rgba(16,185,129,0.4)",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" role="img" aria-label="Spreadsheet icon">
            <title>Spreadsheet icon</title>
            <path
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M9 12h6M9 16h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: "72px",
          fontWeight: 800,
          background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
          backgroundClip: "text",
          color: "transparent",
          margin: "0 0 16px 0",
          letterSpacing: "-2px",
        }}
      >
        {title}
      </h1>

      {/* Tagline */}
      <p
        style={{
          fontSize: "32px",
          color: "rgba(255,255,255,0.8)",
          margin: "0 0 40px 0",
          fontWeight: 500,
        }}
      >
        {tagline}
      </p>

      {/* Feature badges */}
      <div
        style={{
          display: "flex",
          gap: "16px",
        }}
      >
        {features.map((feature) => (
          <div
            key={feature}
            style={{
              padding: "12px 24px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "100px",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              fontSize: "20px",
              fontWeight: 500,
            }}
          >
            {feature}
          </div>
        ))}
      </div>

      {/* URL */}
      <p
        style={{
          position: "absolute",
          bottom: "40px",
          fontSize: "24px",
          color: "rgba(255,255,255,0.5)",
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
