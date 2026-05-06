"use client";

import { useState } from "react";
import { supabase } from "../supabase.js";

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
      <div style={{ padding: 40, fontFamily: "sans-serif" }}>
        <h1>DinnerZen 🌿</h1>
        <p>Your personalized 52-week dinner plan is waiting 👇</p>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button onClick={signUp}>Sign Up</button>
        <button onClick={signIn} style={{ marginLeft: 10 }}>
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

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Welcome to DinnerZen 🌿</h1>
      <h2>✅ Your Full 52-Week Plan Is Unlocked</h2>

      <ul>
        <li>Week 1: Honey Garlic Chicken, Taco Night, Pasta Night, Fried Rice</li>
        <li>Week 2: BBQ Sliders, Beef Chili, Salmon, Shrimp Pasta</li>
        <li>Week 3: Chicken Parmesan, Carnitas Bowls, Stir Fry, Shakshuka</li>
      </ul>
    </div>
  );
}
