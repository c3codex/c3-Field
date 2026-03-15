import React from "react";
import { useNavigate } from "react-router-dom";

export default function ModelContribute() {
  const nav = useNavigate();
  return (
    <main style={{ minHeight: "100vh", background: "#050608", color: "rgba(236,236,236,0.92)", padding: 28 }}>
      <h2 style={{ marginTop: 0 }}>Contribute</h2>
      <p style={{ opacity: 0.78, maxWidth: 720 }}>
        Value enters by choice. This layer will later hold acquire modes + artist contribution pathways.
      </p>
      <button
        onClick={() => nav("/model/create")}
        style={{
          borderRadius: 14, padding: "10px 14px",
          background: "rgba(243, 212, 145, 0.12)",
          border: "1px solid rgba(243, 212, 145, 0.25)",
          color: "rgba(243, 212, 145, 0.95)", cursor: "pointer",
        }}
      >
        Continue to Create
      </button>
    </main>
  );
}
