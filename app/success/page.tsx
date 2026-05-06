"use client";

import { useEffect } from "react";

export default function SuccessPage() {
  useEffect(() => {
    localStorage.setItem("dinnerzenPaid", "true");
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Payment successful 🎉</h1>
      <p>Your full DinnerZen plan is now unlocked.</p>

      <a href="/">
        <button>Go to My Plan</button>
      </a>
    </div>
  );
}