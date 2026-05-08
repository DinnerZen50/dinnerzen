"use client";
import { useState } from "react";
import { supabase } from "../supabase.js";
import { MEALS } from "./data/meals";
const C = {
  ivory: "#faf8f3",
  sand: "#f0ebe0",
  sage: "#7a9e7e",
  sageDark: "#4a7050",
  sageLight: "#e8f0e8",
  brown: "#3d2e1e",
  muted: "#7a6a5a",
  border: "#ddd8cc",
  rust: "#c2472a",
  gold: "#c8921a",
  white: "#ffffff",
};
export default function Home() {
  const [started, setStarted] = useState(false);
  const [paid, setPaid] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert(error.message);
    } else {
      alert("Account created! Now click Log In.");
    }
  };

  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const userId = data.user.id;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("has_paid")
      .eq("id", userId)
      .single();

    if (profileError) {
      alert("Login worked, but payment status could not be checked.");
      return;
    }

    setPaid(profile.has_paid === true);
    setStarted(true);
  };

if (!started) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(160deg, ${C.ivory} 0%, ${C.sand} 100%)`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
        fontFamily: "serif",
      }}
    >
      <div
        style={{
          background: C.white,
          padding: 40,
          borderRadius: 24,
          maxWidth: 500,
          width: "100%",
          boxShadow: "0 10px 40px rgba(74,112,80,.12)",
          border: `1px solid ${C.border}`,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 48,
            marginBottom: 10,
            color: C.sageDark,
          }}
        >
          DinnerZen 🌿
        </h1>

        <p style={{ fontSize: 20, color: C.muted, marginBottom: 30 }}>
          Stress-free family dinners planned for you every week.
        </p>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: 12,
            width: "100%",
            borderRadius: 10,
            border: `1px solid ${C.border}`,
            fontSize: 16,
            marginBottom: 14,
          }}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: 12,
            width: "100%",
            borderRadius: 10,
            border: `1px solid ${C.border}`,
            fontSize: 16,
            marginBottom: 20,
          }}
        />

        <button
          onClick={signUp}
          style={{
            padding: "12px 24px",
            borderRadius: 10,
            border: "none",
            backgroundColor: C.sageDark,
            color: "white",
            fontSize: 16,
            cursor: "pointer",
            marginRight: 10,
          }}
        >
          Sign Up
        </button>

        <button
          onClick={signIn}
          style={{
            padding: "12px 24px",
            borderRadius: 10,
            border: "none",
            backgroundColor: C.brown,
            color: "white",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Log In
        </button>
      </div>
    </div>
  );
}


  if (!paid) {
    return (
      <div style={{ padding: 40, fontFamily: "sans-serif" }}>
        <h2>Your Personalized Weekly Dinner Plan</h2>
        <p>Built for your family, your tastes, and your schedule.</p>

        <ul>
          <li>🍗 Honey Garlic Chicken</li>
          <li>🌮 Taco Night</li>
          <li>🍝 Pasta Night</li>
          <li>🍚 Fried Rice</li>
        </ul>

        <p style={{ marginTop: 20 }}>
          + 51 more weeks ready to go… no more “what’s for dinner?” ever again.
        </p>

        <button
          style={{ marginTop: 20 }}
          onClick={() =>
            window.open(
              "https://buy.stripe.com/test_3cIeVeg3Ef2F7pd9aQ9sk01",
              "_blank"
            )
          }
        >
          🔥 Unlock All 52 Weeks Instantly ($29)
        </button>
      </div>
    );
  }
const logOut = async () => {
  await supabase.auth.signOut();
  setStarted(false);
  setPaid(false);
  setEmail("");
  setPassword("");
};
  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Welcome to DinnerZen 🌿</h1>
      <button onClick={logOut} style={{ marginBottom: 20 }}>
  Log Out
</button>
      <h2>✅ Your Full 52-Week Plan Is Unlocked</h2>

      <div style={{ marginTop: 30 }}>
  {MEALS.slice(0, 6).map((meal) => (
    <div
      key={meal.id}
      style={{
        background: "#f8f8f8",
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        textAlign: "left",
      }}
    >
      <h3>{meal.meal}</h3>

      <p>{meal.description}</p>

      <p>
        ⏱ Prep: {meal.prepTime} | 🍳 Cook: {meal.cookTime}
      </p>

      <p>💰 {meal.cost}</p>
    </div>
  ))}
</div>
    </div>
  );
}
