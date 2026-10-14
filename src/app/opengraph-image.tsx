import { ImageResponse } from "next/og";
import { getSiteContent } from "@/lib/data";

export const alt = "Engenharia, inovação e excelência em cada projeto";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const { profile } = await getSiteContent();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "white",
          background: "linear-gradient(135deg, #061424 0%, #0B1F33 55%, #12304D 100%)",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          backgroundColor: "#0B1F33",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#C8A96B", fontSize: 26, letterSpacing: 4 }}>
          <div style={{ width: 48, height: 2, background: "#C8A96B" }} />
          {profile.headline.toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1, maxWidth: 980 }}>
            Engenharia, inovação e excelência em cada projeto.
          </div>
          <div style={{ marginTop: 24, fontSize: 30, color: "rgba(255,255,255,0.7)" }}>
            Soluções inteligentes, eficientes e sustentáveis.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28 }}>
          <span style={{ fontWeight: 700 }}>{profile.full_name}</span>
          {profile.crea && <span style={{ color: "#C8A96B" }}>{profile.crea}</span>}
        </div>
      </div>
    ),
    size,
  );
}
