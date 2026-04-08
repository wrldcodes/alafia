import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Aláfíà — Health for Every Community";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        background:
          "radial-gradient(circle at 20% 20%, rgba(58,171,138,0.18), transparent 32%), radial-gradient(circle at 82% 18%, rgba(214,168,108,0.16), transparent 28%), linear-gradient(180deg, #fbf8f3 0%, #fefdfb 56%, #f4efe7 100%)",
        color: "#143b34",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: 62,
            height: 62,
            borderRadius: 18,
            background: "#1e7d63",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: "-0.04em",
          }}
        >
          A
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.03em" }}
          >
            Aláfíà
          </div>
          <div
            style={{
              fontSize: 14,
              color: "#4e6c65",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Community health platform
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 22,
          maxWidth: 880,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignSelf: "flex-start",
            padding: "10px 16px",
            borderRadius: 999,
            background: "rgba(30, 125, 99, 0.1)",
            color: "#1e7d63",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.11em",
            textTransform: "uppercase",
          }}
        >
          Health for every community
        </div>
        <div
          style={{
            fontSize: 72,
            lineHeight: 1.02,
            fontWeight: 700,
            letterSpacing: "-0.06em",
            maxWidth: 900,
          }}
        >
          Connect patients to nearby care. Give clinics one place to manage
          everything.
        </div>
        <div
          style={{
            fontSize: 26,
            lineHeight: 1.45,
            color: "#53716b",
            maxWidth: 820,
          }}
        >
          Enroll patients, manage appointments, and share records in a clean
          mobile-friendly portal.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div style={{ display: "flex", gap: 14 }}>
          {["Patients", "Clinics", "Appointments", "Records"].map((item) => (
            <div
              key={item}
              style={{
                padding: "12px 18px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(20, 59, 52, 0.08)",
                fontSize: 18,
                color: "#274942",
              }}
            >
              {item}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 18, color: "#6a7d78" }}>alafia.health</div>
      </div>
    </div>,
    size,
  );
}
