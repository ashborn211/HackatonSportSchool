import React, { useState } from "react";
import "./logo.css";
import logo from "./logo.png"; // ✅ importeer het logo als variabele

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo-container">
          <img src={logo} alt="Sportschool De Kast" className="logo" />
        </div>

        <h1 className="login-title">Log in om verder te gaan.</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Wachtwoord:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Inloggen
          </button>
        </form>
      </div>
    </div>
  );
}
