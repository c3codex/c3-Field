import React from "react";
import { useNavigate } from "react-router-dom";

export default function ModelConnect() {
  const nav = useNavigate();
  return (
    <main style={{ minHeight: "100vh", background: "#050608", color: "rgba(236,236,236,0.92)", padding: 28 }}>
      <h2 style={{ marginTop: 0 }}>Connect</h2>
      <p style={{ opacity: 0.78, maxWidth: 720 }}>
        Orientation without obligation. This is the first depth layer of the c3 Model.
      </p>
      <button
        onClick={() => nav("/model/contribute")}
        style={{
          borderRadius: 14, padding: "10px 14px",
          background: "rgba(243, 212, 145, 0.12)",
          border: "1px solid rgba(243, 212, 145, 0.25)",
          color: "rgba(243, 212, 145, 0.95)", cursor: "pointer",
        }}
      >
        Continue to Contribute
      </button>
    </main>
  );
}

