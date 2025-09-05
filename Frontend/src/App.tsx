import { useState } from "react";
import Login from "./Login";
import MembersList from "./MembersList";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  return (
    <div>
      <h1>Sportschool SaaS Prototype</h1>
      {!token ? <Login onLogin={setToken} /> : <MembersList />}
    </div>
  );
}

export default App;
