import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login/Login";
import Home from "./home/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
