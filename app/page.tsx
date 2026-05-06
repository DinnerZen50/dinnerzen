"use client";

import { useState } from "react";
import { supabase } from "../supabase.js";
import {MEALS} from "./data/meals";

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
    padding: 40,
    fontFamily: "sans-serif",
    maxWidth: 700,
    margin: "0 auto",
    textAlign: "center",
  }}
>
        <h1 style={{ fontSize: 48, marginBottom: 10 }}>
  DinnerZen 🌿
</h1>
        <p style={{ fontSize: 20, color: "#555", marginBottom: 30 }}>
  Stress-free family dinners planned for you every week.
</p>

        <input
  placeholder="Email"
  style={{
    padding: 12,
    width: "100%",
    maxWidth: 400,
    borderRadius: 10,
    border: "1px solid #ccc",
    fontSize: 16,
  }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
  placeholder="Password"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  style={{
    padding: 12,
    width: "100%",
    maxWidth: 400,
    borderRadius: 10,
    border: "1px solid #ccc",
    fontSize: 16,
  }}
/>

        <br /><br />

        <button
  onClick={signUp}
  style={{
    padding: "12px 24px",
    borderRadius: 10,
    border: "none",
    backgroundColor: "#4f7c65",
    color: "white",
    fontSize: 16,
    cursor: "pointer",
  }}
>
  Sign Up
</button>
        <button
  onClick={signIn}
  style={{
    marginLeft: 10,
    padding: "12px 24px",
    borderRadius: 10,
    border: "none",
    backgroundColor: "#1f2937",
    color: "white",
    fontSize: 16,
    cursor: "pointer",
  }}
>
          Log In
        </button>
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
    ><p style={{ fontWeight: "bold", color: "#4f7c65" }}>
  Week {Math.floor(index / 3) + 1} • Dinner {(index % 3) + 1}
</p>
      
      <h3>{meal.meal}</h3>

      <p>{meal.description}</p>

      <p>
        ⏱ Prep: {meal.prepTime} | 🍳 Cook: {meal.cookTime}
      </p>

      <p>💰 {meal.cost}</p>
      <details style={{ marginTop: 12 }}>
  <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
    View ingredients
  </summary>

  <ul>
    {meal.ingredients.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
</details><details style={{ marginTop: 12 }}>
  <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
    View instructions
  </summary>

  <ol>
    {meal.steps.map((step, i) => (
      <li key={i}>{step}</li>
    ))}
  </ol>
</details><div
  style={{
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    background: "#fff7ed",
    border: "1px solid #fed7aa",
  }}
>
  <strong>🙈 Picky Eater Adjustment:</strong>
  <p style={{ marginBottom: 0 }}>{meal.pickyVersion}</p>
</div>
      
      
    </div>
  ))}
</div>
    </div>
  );
}
