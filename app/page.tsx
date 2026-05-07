"use client";

import { useState } from "react";
import { supabase } from "../supabase.js";
import {MEALS} from "./data/meals";
const colors = {
  sage: "#7c9a7c",
  softSage: "#a8c3a8",
  cream: "#f7f3eb",
  beige: "#e6dccd",
  tan: "#d2b48c",
  text: "#4b4b4b",
};
export default function Home() {
  const [started, setStarted] = useState(false);
  const [paid, setPaid] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [favorites, setFavorites] =useState([]);

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
    backgroundColor: colors.sage,
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
    backgroundColor: colors.sage,
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
    <div>
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Welcome to DinnerZen 🌿</h1>
      <button onClick={logOut} style={{ marginBottom: 20 }}>
  Log Out
</button>
      <h2>✅ Your Full 52-Week Plan Is Unlocked</h2>
      <div
  style={{
    display: "inline-block",
    background: colors.beige,
    color: colors.text,
    padding: "8px 14px",
    borderRadius: 999,
    fontWeight: "bold",
    marginBottom: 20,
  }}
>
  Showing 21 of 252 planned dinners
</div>
<div
  style={{
    background: colors.beige,
    padding: 20,
    borderRadius: 16,
    marginTop: 30,
    marginBottom: 24,
    border: `1px solid ${colors.softSage}`,
  }}
>
  <h2 style={{ marginTop: 0 }}>
    🌿 Your Personalized Dinner Plan
  </h2>

  <p style={{ marginBottom: 0 }}>
    Family-friendly meals customized for busy nights, picky eaters,
    and real life.
  </p>
</div>
      <div style={{ marginTop: 30 }}>
  {MEALS.slice(0, 21).map((meal, index) => (
    <div
      key={meal.id}
      style={{
        background: colors.cream,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
border: '1px solid ${colors.beige}',
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        textAlign: "left",
      }}
    ><p style={{ fontWeight: "bold", color: colors.softSage }}>
  Week {Math.floor(index / 3) + 1} • Dinner {(index % 3) + 1}
</p>
      
      <h3>{meal.meal}</h3>
     <div
  style={{
    display: "inline-block",
    background: colors.softSage,
    color: colors.text,
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
  }}
>
  ⭐ Family Approved
</div> 
    <button
  onClick={() => {
    if (favorites.includes(meal.id)) {
      setFavorites(favorites.filter((id) => id !== meal.id));
    } else {
      setFavorites([...favorites, meal.id]);
    }
  }}
  style={{
    border: "none",
    background: "transparent",
    fontSize: 24,
    cursor: "pointer",
    marginBottom: 10,
  }}
>
  {favorites.includes(meal.id) ? "❤️Saved" : "🤍Save Favorite"}
</button>
<p
  style={{
    color: colors.text,
    fontSize: 13,
    marginTop: 8,
  }}
>
  🍽️ {meal.proteinType} Dinner
</p>
      <p>{meal.description}</p>
      <div
  style={{
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 10,
    marginBottom: 10,
  }}
>
  <span style={{ background: colors.beige, padding: "6px 10px", borderRadius: 999, fontSize: 12 }}>
    💪 Protein: {meal.protein}
  </span>

  <span style={{ background: colors.beige, padding: "6px 10px", borderRadius: 999, fontSize: 12 }}>
    🔥 Calories: {meal.calories}
  </span>

  <span style={{ background: colors.beige, padding: "6px 10px", borderRadius: 999, fontSize: 12 }}>
    🍞 Carbs: {meal.carbs}
  </span>

  <span style={{ background: colors.beige, padding: "6px 10px", borderRadius: 999, fontSize: 12 }}>
    🧈 Fat: {meal.fat}
  </span>
</div>
    <div
  style={{
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    background: colors.cream,
    border: `1px solid ${colors.beige}` ,
    color: colors.text,
    fontSize: 14,
  }}
>
  ✨ Balanced for busy families: protein, comfort, and weeknight simplicity.
</div> 
<div
  style={{
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 10,
    marginBottom: 10,
  }}
>
  <span
    style={{
      background: colors.softSage,
      padding: "5px 10px",
      borderRadius: 999,
      fontSize: 12,
    }}
  >
    🍽️ Comfort Food
  </span>

  <span
    style={{
      background: colors.softSage,
      padding: "5px 10px",
      borderRadius: 999,
      fontSize: 12,
    }}
  >
    ⚡ Family Favorite
  </span>

  <span
    style={{
      background: colors.softSage,
      padding: "5px 10px",
      borderRadius: 999,
      fontSize: 12,
    }}
  >
    ⏱️ Weeknight Easy
  </span>
</div>
      <div
  style={{
    display: "flex",
    gap: 10,
    marginTop: 10,
    marginBottom: 10,
    flexWrap: "wrap",
  }}
>
  <div
    style={{
      background: colors.softSage,
      padding: "6px 12px",
      borderRadius: 999,
      fontSize: 13,
    }}
  >
    ⏱ Prep: {meal.prepTime}
  </div>

  <div
    style={{
      background: colors.softSage,
      padding: "6px 12px",
      borderRadius: 999,
      fontSize: 13,
    }}
  >
    🔥 Cook: {meal.cookTime}
  </div>
</div>
      <div
  style={{
    background: "#fef3c7",
    color: colors.text,
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 13,
    marginBottom: 12,
  }}
>
  💰 Estimated Cost: {meal.cost}
</div><div
  style={{
    background: "#ecfccb",
    color: colors.text,
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 13,
    marginLeft: 8,
    marginBottom: 12,
  }}
>
  👨‍👩‍👧‍👦 Serves about {totalPeople}
</div>
      <div
  style={{
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 10,
    marginBottom: 10,
  }}
>
  <span
    style={{
      background: colors.softsage,
      padding: "6px 10px",
      borderRadius: 999,
      fontSize: 12,
    }}
  >
    💪 {meal.protein}
  </span>

  <span
    style={{
      background: colors.softSage,
      padding: "6px 10px",
      borderRadius: 999,
      fontSize: 12,
    }}
  >
    🍞 {meal.carbs}
  </span>

  <span
    style={{
      background: colors.softSage,
      padding: "6px 10px",
      borderRadius: 999,
      fontSize: 12,
    }}
  >
    🔥 {meal.calories} cal
  </span>
</div>

      <p>💰 {meal.cost}</p>
      <details style={{ marginTop: 12 }}>
  <summary
  style={{
    cursor: "pointer",
    fontWeight: "bold",
    color: colors.text,
  }}
>
 🛒 View Full Ingredient List
</summary>

  <ul style={{ paddingLeft: 20, lineHeight: 1.8}}>
    {meal.ingredients.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
</details><details style={{ marginTop: 12 }}>
  <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
    👩‍🍳 View Step-by-Step Instructions
  </summary>

  <ol> style={{ paddingLeft: 20, lineHeight: 1.8}}>
    {meal.steps.map((step, i) => (
      <li key={i}>{step}</li>
    ))}
  </ol>
</details><div
  style={{
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    background: colors.cream,
    border: `1px solid ${colors.beige}`,
  }}
>
  <strong>🙈 Picky Eater Adjustment:</strong>
  <p style={{ marginBottom: 0 }}>{meal.pickyVersion}</p>
</div>
    {meal.veggieAlt && (
  <div
    style={{
      marginTop: 12,
      padding: 12,
      borderRadius: 10,
      background: colors.cream,
      border: `1px solid ${colors.beige}` ,
    }}
  >
    <strong>🥦 Vegetarian Option:</strong>
    <p style={{ marginBottom: 4 }}>{meal.veggieAlt.meal}</p>
    <p style={{ marginBottom: 0, color: "#555" }}>
      {meal.veggieAlt.vegNote}
    </p>
  </div>
      <div
  style={{
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    background: colors.cream,
    border: `1px solid ${colors.beige}`,
  }}
>
  <strong>🍽️ Portion Notes:</strong>
  <p style={{ marginBottom: 0 }}>{meal.portionNotes}</p>
</div>
)}  
      
      
    </div>
  ))}
</div>
   <div
  style={{
    marginTop: 40,
    padding: 24,
    borderRadius: 16,
    background: colors.cream,
    border: `1px dashed ${colors.beige}`,
    textAlign: "left",
  }}
>
  <h2>🚀 Coming Soon</h2>

  <ul style={{ lineHeight: 2 }}>
    <li>🛒 Automatic grocery lists</li>
    <li>📅 Full weekly calendar mode</li>
    <li>🥦 Vegetarian swap automation</li>
    <li>💰 Pantry meal generator</li>
    <li>🍮 Dessert add-on packs</li>
    <li>❤️ Saved favorites dashboard</li>
    <li>📱 Mobile app version</li>
  </ul>
</div> 
    </div>
  );
}
