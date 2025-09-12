import React, { useEffect, useState } from "react";

export default function Home() {
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  if (!token) {
    setError("⚠️ Je bent niet ingelogd. Ga terug naar login.");
    return;
  } else {
    console.log("Token found:", token);
  }

  return (
    <div>
      <h1>Welkom op de Home Pagina 🎉</h1>
    </div>
  );
}
